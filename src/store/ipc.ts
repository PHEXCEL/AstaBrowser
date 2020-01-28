import Electron from "electron"
import { IPCStatus, IPCChannelName } from "../main/IPC"

export function requestChannel(channel: IPCChannelName, ipc: Electron.IpcRenderer) {
    return new Promise((resolve, reject) => {

        const cb = (e: Electron.Event, status: IPCStatus, resp: unknown) => {
            console.log('====================================');
            console.log('ipc received');
            console.log('====================================');
            switch (status) {
                case "success":
                    removeListener()
                    resolve(resp)
                    break
                case "fail":
                    removeListener()
                    reject()
                    break
            }
        }
        ipc.once(channel, cb)
        ipc.send(channel)
        function removeListener() {
            ipc.removeListener(channel, cb)
        }
    })
}