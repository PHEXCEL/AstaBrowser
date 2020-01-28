import { createSlice } from "@reduxjs/toolkit"
import Store from "electron-store"
import path from 'path'
import os from 'os'
import fs from 'fs'

// store
const store = new Store()

const defaultSavePath = path.join(os.homedir(), 'Downloads')
const getSavePath = (): string => {
    return store.get<string>('savePath', defaultSavePath)
}
const defaultUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
const getUserAgent = (): string => {
    return store.get<string>('userAgent', defaultUserAgent)
}

// state
export interface SettingState {
    savePath: string
    userAgent: string
}

const initialState: SettingState = {
    savePath: getSavePath(),
    userAgent: getUserAgent(),
}

export interface StringSettingType {
    value: string
}

// make slice
const slice = createSlice({
    name: "setting",
    initialState,
    reducers: {
      changeSavePath: (state, action: {payload: StringSettingType}) => {
          const path = action.payload.value
          try {
            fs.statSync(path);
            state.savePath = action.payload.value
            store.set("savePath", action.payload.value)
            console.log('ファイル・ディレクトリは存在します。');
          } catch (error) {
            if (error.code === 'ENOENT') {
              console.log('ファイル・ディレクトリは存在しません。');
            } else {
              console.log(error);
            }
          }
      },
      changeUserAgent: (state, action: {payload: StringSettingType}) => {
          state.userAgent = action.payload.value
          store.set("userAgent", action.payload.value)
      },
      setDefaultSettings: (state, action: {payload: undefined}) => {
        state.userAgent = defaultUserAgent
        state.savePath = defaultSavePath
        store.set("savePath", defaultSavePath)
        store.set("userAgent", defaultUserAgent)
      }
    }
  });

export default slice;
