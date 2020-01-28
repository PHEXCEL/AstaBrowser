import { ipcRenderer } from "electron"
import NormalDownloader from "./downloader/normal"
import NicoNicoDownloader from "./downloader/niconico"
import AvgleDownloader from "./downloader/avgle"
import DailymotionDownloader from "./downloader/dailymotion"
import Store from "../store/"
import dlSlice, { DLVideo, Resolution, CatchVideo } from "../store/dl"
import uiSlice from "../store/ui"
import {Subject} from "rxjs"
import ElectronStore from "electron-store"
import Url from "url"

const Downloaders: (typeof NormalDownloader)[] = [
    NicoNicoDownloader,
    AvgleDownloader,
    DailymotionDownloader,
]

export type FileType = "HLS" | "MP4"

export type DetectResolutions = (resolutions: Resolution[]) => void
export type StatusChanged = (done: number, total: number, progress: number) => void

export interface DLManagerDelegate {
    catchVideo: (catchVideo: CatchVideo) => void
    detectResolution: (resolutions: Resolution[]) => void
    statusChanged: (videoIndex: number, done: number, total: number, progress: number) => void
    endDownload: (downloader: NormalDownloader) => void
    setError: (error: Error, videoIndex: number) => void
}

// electron store
export type downloadLimitStoreType = {[key: string]: number}
const electronStore = new ElectronStore({accessPropertiesByDotNotation: false})
if(!electronStore.has("limits")) {
    electronStore.set("limits", {})
}
const setLimitToStore = (domain: string) => {
    const limits: downloadLimitStoreType = electronStore.get("limits")
    limits[domain] = (new Date()).getTime()
    electronStore.set("limits", limits)
}

export default class DLManager implements DLManagerDelegate{
    store: typeof Store
    currentUrl: string = ""
    downloader?: NormalDownloader = undefined
    dlVideosLastItem?: DLVideo = undefined
    pageTitle?: string = undefined
    resolutions$ =  new Subject<Resolution[]>()
    downloading: NormalDownloader[] = []

    constructor(store: typeof Store) {
        this.store = store
        this.store.subscribe(this.storeListener)
        ipcRenderer.on('onBeforeSendHeaders', (e: Electron.IpcRendererEvent, details: Electron.OnBeforeSendHeadersListenerDetails) => {
            this.downloader?.interceptRequest(details)
        })
    }

    catchVideo = (catchVideo: CatchVideo) => {
        console.log('====================================');
        console.log('catch video', catchVideo.videoUrl);
        console.log('====================================');
        catchVideo.title = (this.pageTitle || 'video') + catchVideo.title
        catchVideo.pageUrl = this.currentUrl
        this.store.dispatch(dlSlice.actions.push(catchVideo))
    }

    storeListener = () => {
        let state = this.store.getState()
        // browser url chan2ged
        if(state.browser.history[state.browser.history.length - 1] !== this.currentUrl) {
            this.currentUrl = state.browser.history[state.browser.history.length - 1]

            // catch video listをクリアする
            this.store.dispatch(dlSlice.actions.clear())

            // downloaderを探す
            this.searchDownloader()
        }

        // page title changed
        if(state.browser.pageTitle !== this.pageTitle) {
            this.pageTitle = state.browser.pageTitle
        }
    }

    searchDownloader = () => {
        let isSearched = false
        for (const downloader of Downloaders) {
            if(downloader.check(this.currentUrl)) {
                isSearched = true
                console.log('detect downloader====================================');
                console.log(downloader.downloaderName);
                console.log('====================================');
                this.downloader = new downloader()
                this.downloader.delegate = this
                break
            }
        }

        // default downloader
        if(!isSearched) {
            console.log('====================================');
            console.log("Normal");
            console.log('====================================');
            this.downloader = new NormalDownloader()
            this.downloader.delegate = this
        }
    }

    getDownloader = (url: string): NormalDownloader => {
        for (const downloader of Downloaders) {
            if(downloader.check(url)) {
                console.log('detect downloader====================================');
                console.log(downloader.downloaderName);
                console.log('====================================');
                const selectedDownloader = new downloader()
                selectedDownloader.delegate = this
                return selectedDownloader
            }
        }
        const defaultDownloader = new NormalDownloader()
        defaultDownloader.delegate = this
        console.log('====================================');
        console.log("Normal");
        console.log('====================================');
        return defaultDownloader
    }

    statusChanged = (videoIndex: number, done: number, total: number, progress: number) => {
        this.store.dispatch(dlSlice.actions.changeProgress({
            videoIndex: videoIndex,
            done: done,
            total: total,
            progress: progress
        }))
        ipcRenderer.send("app.change-progress", { progress: done / total})
    }

    detectResolution = (resolutions: Resolution[]) => {
        this.resolutions$.next(resolutions)
    }

    doDownload = (catchVideo: CatchVideo) => {
        const downloader = this.getDownloader(catchVideo.pageUrl)
        const state = this.store.getState()
        if(downloader !== undefined) {
            if(process.env.NODE_ENV === "production") {
                // add limit
                const domain = Url.parse(catchVideo.pageUrl).hostname || ""
                const limits: downloadLimitStoreType = electronStore.get("limits")
                if(domain in limits) {
                    const date = limits[domain]
                    if(((new Date()).getTime() - date) / 60 / 1000 < 30) {
                        const minute = 30 - Math.floor(((new Date()).getTime() - date) / 60 / 1000)
                        this.store.dispatch(dlSlice.actions.setError(new Error(`AstaBrowser places a limit on the number of downloads. Please be sure to download after ${minute} minutes.`)))
                        return
                    } else {
                        setLimitToStore(domain)
                    }
                } else {
                    setLimitToStore(domain)
                }
            }
            this.downloading.push(downloader)
            downloader.delegate = this
            downloader.set(catchVideo, state.setting.savePath)
            const dlVideo: DLVideo = {
               pageUrl: catchVideo.pageUrl,
               videoUrl: catchVideo.videoUrl,
               title: catchVideo.title,
               type: catchVideo.type,
               headers: catchVideo.headers,
               done: 0,
               total: 1,
               isCancel: false,
               isStop: false,
               videoIndex: state.dl.dlVideos.length,
               progress: 0
            }
            this.store.dispatch(dlSlice.actions.pushDownload(dlVideo))
            downloader.videoIndex = state.dl.dlVideos.length
            downloader.videoTitle = this.pageTitle || ""
            downloader.run()
        } else {
            this.store.dispatch(dlSlice.actions.setError(new Error("downloader is undefined.")))
        }
    }

    selectResolution = (resolution: Resolution) => {
        resolution.downloader.resume(resolution)
    }

    endDownload = (downloader: NormalDownloader) => {
        this.store.dispatch(uiSlice.actions.openDLEndToast({isOpen: true}))
        this.store.dispatch(dlSlice.actions.complete({videoIndex: downloader.videoIndex}))
        ipcRenderer.send("app.change-progress", { progress: -1})
    }

    cancelDownload = (videoIndex: number) => {
        for(let i=0; i < this.downloading.length; i++) {
            if(this.downloading[i].videoIndex === videoIndex) {
                this.downloading[i].isCalcel = true
                this.downloading = this.downloading.splice(i, 1)
                break
            }
        }
        ipcRenderer.send("app.change-progress", { progress: -1})
    }

    setError = (error: Error, videoIndex: number) => {
        this.cancelDownload(videoIndex)
        this.store.dispatch(dlSlice.actions.setError(error))
    }
}
