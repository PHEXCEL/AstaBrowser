import Electron from "electron"
import { appName, appVersion } from "./util"

export type IPCChannelName = "app.get-name" | "app.get-version" | "app.change-progress"
export interface ChangeProgress {
    progress: number
}

export default function setIPC(win: Electron.BrowserWindow) {
    const { ipcMain: ipc } = Electron

    ipc.on("app.get-name", e => e.sender.send("app.get-name", "success", appName))
    ipc.on("app.get-version", e => {e.sender.send("app.get-version", "success", appVersion)})
    ipc.on("app.change-progress", (e, args) => {
        const typedArgs = args as ChangeProgress
        win.setProgressBar(typedArgs.progress)
    })
}

export type IPCStatus = "success" | "fail"