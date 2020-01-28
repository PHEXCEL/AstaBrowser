import Electron from "electron"
import { createSlice } from "@reduxjs/toolkit"
import { AppThunk } from "./"
import { requestChannel } from "./ipc"

export interface AppState {
    appName: string
    version: string
    reportUrl: string
    requestUrl: string
    hpUrl: string
}

const initialState: AppState = {
    appName: "AstaBrowser",
    version: "",
    reportUrl: "https://phexcel.work/a-star-downloader-bug-report/",
    requestUrl: "https://phexcel.work/a-star-downloader-request-form/",
    hpUrl: "https://phexcel.work",
}

export interface AppName {
    appName: string
}

const { ipcRenderer: ipc } = Electron

// make slice
const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
      setName: (state: AppState, action: {payload: AppName}) => {
        state.appName = action.payload.appName
      },
      setVersion: (state: AppState, action: {payload: string}) => {
        state.version = action.payload
      },
    }
  });

export const getAppInfoThunk = (): AppThunk => async (dispatch) => {
  const version = await requestChannel("app.get-version", ipc) as string
  dispatch(slice.actions.setVersion(version))
}

export default slice;