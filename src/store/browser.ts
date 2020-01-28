import { createSlice } from "@reduxjs/toolkit"

// DEBUG: ここにホームページを貼る
export const ROOT_URL = "https://phexcel.work/a-star-downloader-start-page/"

export interface BrowserState {
    history: [string],
    pageTitle: string,
    reload: boolean,
}

const initialState: BrowserState = {
    history: [ROOT_URL],
    pageTitle: '',
    reload: false
}

export interface PushType {
  url: string
}

export interface ChangeTitle {
  title: string
}

// make slice
const slice = createSlice({
    name: "browser",
    initialState,
    reducers: {
      push: (state, action: {payload: PushType}) => {
        let url = action.payload.url
        if(url === "") {
          return
        }
        if(state.history[state.history.length - 1] === action.payload.url) {
          return
        }
        if(!action.payload.url.match(/\./) && !action.payload.url.startsWith("http")) { // キーワード検索
          url = `https://google.com/search?q=${encodeURIComponent(url)}`
        }
        if(!url.startsWith("http")) {
          url = "http://" + url
        }
        state.history.push(url)
      },
      pop: (state, action: {payload: undefined}) => {
        if(state.history.length === 1) {
          return
        }
        state.history.pop()
      },
      changeTitle: (state, action: {payload: ChangeTitle}) => {
        state.pageTitle = action.payload.title
      },
      reload: (state, action: {payload: undefined}) => {
        state.reload = !state.reload
      },
    }
  });

export default slice;
