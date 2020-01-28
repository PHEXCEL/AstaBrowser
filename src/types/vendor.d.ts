import DLManager from "../DL"
declare global {
  namespace NodeJS {
    interface Global {
        dlManager: DLManager
    }
  }
}