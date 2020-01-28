import Electron from "electron"

export function isDevMode() {
    return !Electron.app.isPackaged
}

export const appPath = isDevMode() ? process.cwd() : Electron.app.getAppPath()
export const appName = process.env.APP_NAME
export const appVersion = Electron.app.getVersion()
