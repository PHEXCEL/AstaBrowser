import { createSlice } from "@reduxjs/toolkit"

export interface UIState {
    isOpenDLWindow: boolean
    isOpenSettingWindow: boolean
    isOpenAboutWindow: boolean
    isOpenCatchWindow: boolean
    isOpenDLStartToast: boolean
    isOpenDLEndToast: boolean
}

const initialState: UIState = {
    isOpenDLWindow: false,
    isOpenSettingWindow: false,
    isOpenAboutWindow: false,
    isOpenCatchWindow: false,
    isOpenDLStartToast: false,
    isOpenDLEndToast: false,
}

export interface IsOpenType {
  isOpen: boolean
}

// make slice
const slice = createSlice({
    name: "ui",
    initialState,
    reducers: {
      openDLWindow: (state, action: {payload: IsOpenType}) => {
        state.isOpenDLWindow = action.payload.isOpen
      },
      openSettingWindow: (state, action: {payload: IsOpenType}) => {
        state.isOpenSettingWindow = action.payload.isOpen
      },
      openAboutWindow: (state, action: {payload: IsOpenType}) => {
        state.isOpenAboutWindow = action.payload.isOpen
      },
      openCatchWindow: (state, action: {payload: IsOpenType}) => {
        state.isOpenCatchWindow = action.payload.isOpen
      },
      openDLStartToast: (state, action: {payload: IsOpenType}) => {
        state.isOpenDLStartToast = action.payload.isOpen
      },
      openDLEndToast: (state, action: {payload: IsOpenType}) => {
        state.isOpenDLEndToast = action.payload.isOpen
      },
    }
  });

export default slice;
