import React, {useEffect, useState} from "react"
import contextMenu from "electron-context-menu"

//redux
import { useSelector, useDispatch } from "react-redux"
import { RootReducerType } from "../../store"
import browserSlice, { BrowserState } from "../../store/browser"
import { SettingState } from "../../store/setting"
import { DLState } from "../../store/dl"

// style
export default function Browser(): JSX.Element {
    const [isInit, setIsInit] = useState<boolean>(true)
    const browserState: BrowserState = useSelector((state: RootReducerType) => state.browser)
    const settingState: SettingState = useSelector((state: RootReducerType) => state.setting)
    const dlState: DLState = useSelector((state: RootReducerType) => state.dl)
    const dispatch = useDispatch()
    useEffect(()=>{
      const webview: Electron.WebviewTag | null = document.querySelector("#wv")
      webview?.addEventListener('did-navigate', ()=>{
        const url = webview?.getURL()
        dispatch(browserSlice.actions.push({url: url}))
      })
      webview?.addEventListener('page-title-updated', ()=>{
        const title = webview?.getTitle()
        dispatch(browserSlice.actions.changeTitle({title: title}))
      })
      if(webview) {
        contextMenu({
          window: webview,
          showInspectElement: false,
        })
      }
    }, [])
    useEffect(() => {  // stop video at start download
      if(dlState.dlVideos.length > 0) {
        const webview: Electron.WebviewTag | null = document.querySelector("#wv")
        webview?.executeJavaScript('var a = document.querySelector("video"); if(a){a.pause()}')
      }
    }, [dlState.dlVideos])
    useEffect(() => {
      if(isInit) {
        setIsInit(false)
        return
      }
      const webview: Electron.WebviewTag | null = document.querySelector("#wv")
      webview?.reload()
    }, [browserState.reload])


    return (
        <webview
            id="wv"
            autosize
            style={{height: '100%'}}
            src={browserState.history[browserState.history.length - 1]}
            useragent={settingState.userAgent}
        >
        </webview>
    )
  }
