import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux";
import appState, {AppState} from "./app";
import browserState, {BrowserState} from "./browser"
import uiState, {UIState} from "./ui"
import settingState, {SettingState} from "./setting"
import dlState, {DLState} from "./dl"
import { Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import { ThunkAction } from "redux-thunk"

export interface RootReducerType {
  app: AppState,
  browser: BrowserState,
  ui: UIState,
  setting: SettingState,
  dl: DLState
}

const rootReducer = combineReducers({
    app: appState.reducer,
    browser: browserState.reducer,
    ui: uiState.reducer,
    setting: settingState.reducer,
    dl: dlState.reducer,
})

declare namespace window {
  export const __REDUX_DEVTOOLS_EXTENSION__: Function;
}

export const setupStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        devTools: window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : false,
        middleware: getDefaultMiddleware({
            serializableCheck: false,
        }),
    })
    return store
}

export default setupStore()
export type AppThunk = ThunkAction<void, RootReducerType, null, Action<string>>