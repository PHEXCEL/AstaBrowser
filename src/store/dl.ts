import { createSlice } from "@reduxjs/toolkit"
import { FileType } from "../DL"
import { AppThunk } from "../store/"
import NormalDownloader from "../DL/downloader/normal"

export interface CatchVideo {
    pageUrl: string
    videoUrl: string
    title: string
    type: FileType
    headers: {[key: string]: string}
    option?: {[key: string]: any}
}

export interface DLVideo extends CatchVideo {
    done: number
    total: number
    progress: number
    isCancel: boolean
    isStop: boolean
    videoIndex: number
}

export interface Resolution {
    width: number
    height: number
    bitrate: number
    url: string
    downloader: NormalDownloader
}

export interface DLState {
    catchVideos: CatchVideo[]
    dlVideos: DLVideo[]
    error?: Error
}

const initialState: DLState = {
    catchVideos: [
    ],
    dlVideos: [
    ],
    error: undefined
}

export interface ChangeProgressType {
    videoIndex: number,
    done: number
    total: number
    progress: number
}

// make slice
const slice = createSlice({
    name: "dl",
    // DEBUG: ここを直す
    initialState,
    reducers: {
      push: (state, action: {payload: CatchVideo}) => {
          state.catchVideos.push(action.payload)
      },
      clear: (state, action: {payload: undefined}) => {
          state.catchVideos = []
      },
      changeProgress: (state, action: {payload: ChangeProgressType}) => {
          const status = action.payload
          for (let i = 0; i < state.dlVideos.length; i++) {
            if(state.dlVideos[i].videoIndex === action.payload.videoIndex) {
              state.dlVideos[i].done = status.done
              state.dlVideos[i].total = status.total
              state.dlVideos[i].progress = status.progress
              break
            }
          }
      },
      cancel: (state, action: {payload: {videoIndex: number}}) => {
        state.dlVideos[action.payload.videoIndex].isCancel = true
      },
      complete: (state, action: {payload: {videoIndex: number}}) => {
        state.dlVideos[action.payload.videoIndex].isCancel = true
      },
      pushDownload: (state, action: {payload: DLVideo}) => {
        state.dlVideos.push(action.payload)
      },
      deleteDownload: (state, action: {payload: {videoIndex: number}}) => {
        for (let i = 0; i < state.dlVideos.length; i++) {
          if(state.dlVideos[i].videoIndex === action.payload.videoIndex) {
            state.dlVideos = state.dlVideos.splice(i, 1)
            break
          }
        }
      },
      setError: (state, action: {payload: Error}) => {
        state.error = action.payload
      }
    },
  });

export const downloadThunk = (catchVideo: CatchVideo): AppThunk => (dispatch, getState) => {
  global.dlManager.doDownload(catchVideo)
}

export const cancelThunk = (videoIndex: number): AppThunk => (dispatch, getState) => {
  global.dlManager.cancelDownload(videoIndex)
  dispatch(slice.actions.cancel({videoIndex: videoIndex}))
}

export default slice;
