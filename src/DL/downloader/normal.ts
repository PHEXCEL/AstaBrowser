import { Resolution, CatchVideo } from "../../store/dl"
import { FileType, DLManagerDelegate } from "../"
import request from "request"
import zlib from "zlib"
import path from "path"
import urljoin from "url-join"
import M3U8Parser from "../m3u8parser/loader/m3u8-parser"
import { PlaylistLevelType } from "../m3u8parser/types/loader"
import { createDecipheriv, Decipher } from "crypto"
import fs from "fs"

class ForbbidenError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ForbbidenError';
    }
  }

export default class NormalDownloader {
  static matchUrl = new RegExp('.*?')
  static downloaderName = 'Normal'
  static check(url: string) {
    return url.match(this.matchUrl)
  }
  catchVideo?: CatchVideo
  done: number = 0
  total: number = 1
  type: FileType = "HLS"
  delegate?: DLManagerDelegate
  videoIndex: number = -1
  videoTitle = ""
  savePath = ""
  tsList: Buffer[] = []
  isCalcel = false
  isErrorOccured = false

  set(catchVideo: CatchVideo, savePath: string) {
    this.catchVideo = catchVideo
    this.savePath = savePath
  }

  interceptRequest = (
    details: Electron.OnBeforeSendHeadersListenerDetails) =>
  {
    console.log('====================================');
    console.log('intercept', details.url);
    console.log('====================================');
    if (details.url.match('\\.m3u8')) {
      this.delegate?.catchVideo({
        pageUrl: '',
        videoUrl: details.url,
        title: '.ts',
        type: 'HLS',
        headers: details.requestHeaders,
      })
      return
    }
    if (details.url.match('\\.mp4')) {
      this.delegate?.catchVideo({
        pageUrl: '',
        videoUrl: details.url,
        title: '.mp4',
        type: 'MP4',
        headers: details.requestHeaders,
      })
      return
    }
  }

  static stringify(instance:NormalDownloader): string {
    return `${instance.done}`
  }

  static parse(serialized:string): NormalDownloader {
    return new NormalDownloader()
  }

  toString(): string {
    return `${this.done}`
  }

  protected downloadFile = (url: string, headers: {[key: string]: string}): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('download====================================');
      console.log(url);
      console.log('====================================');

      const options = {
        headers: headers,
        method: 'GET',
        encoding: null,
        gzip: true,
        followAllRedirects: true,
      }
      request(url, options, (error, response, body) => {
        if (error !== null) {
          reject(error)
          }
          if(!('content-encoding' in response.headers)) {
          resolve(body.toString('utf-8'));
          }
          switch(response.headers['content-encoding']) {
          case 'br':
            resolve(zlib.brotliDecompressSync(body).toString('utf-8'));
            break
          case 'gzip':
            resolve(body.toString('utf-8'));
            break
          case 'deflate':
            resolve(body.toString('utf-8'));
            break
          default:
            resolve(body.toString('utf-8'));
            break
          }
      })
    })
  }

  protected downloadBuffer = (url: string, headers: {[key: string]: string}): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        request.get({
            url: url,
            headers: headers,
            encoding: null
        }, function (error, response, body){
            if (error) {
                reject(error);
            }
            console.log('====================================');
            console.log(response.statusCode);
            console.log('====================================');
            if (response.statusCode === 200) {
                resolve(body);
            } else if(response.statusCode === 403) {
                console.log('====================================');
                console.log(body);
                console.log('====================================');
                reject(new ForbbidenError('403 response returned'));
            } else if(response.statusCode === 404){
                reject(new Error("TS file does not exist."));
            } else {
              reject(new Error("A unknown error occured. (000001)"))
            }
        });
    });
  }

  protected downloadBufferTry = async (url: string, headers: {[key: string]: string}): Promise<Buffer | undefined> => {
    // download
    let ts: undefined | Buffer = undefined
    let e: Error | undefined = undefined
    for(let t=0; t<5; t++) {
        try {
            ts = await this.downloadBuffer(url, headers)
        } catch(error) {
            e = error
            continue
        }
        if(ts) {
            return ts
        }
    }
    if(e) {
        throw e
    }
    return undefined
  }

  downloadHLS = (): Promise<undefined> => {
    return new Promise( async (resolve, reject) => {
      if (this.catchVideo === undefined) {
        this.delegate?.setError(new Error("video data is undefined."), this.videoIndex)
        return
      }
      if (this.catchVideo.type === "HLS") {
        try {
          const body = await this.downloadFile(this.catchVideo.videoUrl, this.catchVideo.headers)
          console.log('====================================');
          console.log(body);
          console.log('====================================');
          const baseUrl = path.dirname(this.catchVideo.videoUrl)
          const playlists = M3U8Parser.parseMasterPlaylist(body, "")
          console.log(playlists);

          // 複数の解像度を確認
          if (playlists.length > 0) {
            let resolutions: Resolution[] = []
            for (const playlist of playlists) {
                console.log(playlist);

              if (!playlist.url.startsWith('http')) {
                playlist.url = urljoin(baseUrl, playlist.url)
              }
              console.log(playlist.url);

              resolutions.push(
                {
                  width: playlist.width,
                  height: playlist.height,
                  bitrate: playlist.bitrate,
                  url: playlist.url,
                  downloader: this
                }
              )
            }
            // 解像度を通知
            this.delegate?.detectResolution(resolutions)
          } else {
            this.resume({
              width: 0,
              height: 0,
              bitrate: 0,
              downloader: this,
              url: this.catchVideo.videoUrl
            })

          }
        } catch(e) {
          this.delegate?.setError(e, this.videoIndex)
          return
        }
      }
    })
  }

  run = () => {
    this.downloadHLS()
  }

  downloadPlaylist = async (url: string, headers: {[key: string]: string}) => {
    try {
      return await this.downloadFile(url, headers)
    } catch(e) {
      throw e
    }
  }

  getBaseUrl = (url: string): string => {
      return path.dirname(url)
  }

  resume = async (resolution: Resolution) => {
    const url = resolution.url
    if(this.catchVideo === undefined) {
      this.delegate?.setError(new Error("Video Info is undefined."), this.videoIndex)
      return
    }
    if(this.catchVideo.type === "HLS") {
      let body: undefined | string = undefined
      try{
        body = await this.downloadPlaylist(url, this.catchVideo.headers)
      } catch(e) {
        this.delegate?.setError(e, this.videoIndex)
      }
      if(body === undefined) {
        this.delegate?.setError(new Error("Failed to get playlist."), this.videoIndex)
        return
      }
      console.log('====================================');
      console.log(body);
      console.log('====================================');
      const baseUrl = this.getBaseUrl(url)
      console.log(baseUrl);
      const playlists = M3U8Parser.parseLevelPlaylist(body, baseUrl, 0, PlaylistLevelType.MAIN, 0)
      let i = 1
      const len = playlists.fragments.length
      let uri = ''
      let key: undefined | Buffer = undefined
      let decipher: undefined | Decipher = undefined

      for(const fragment of playlists.fragments) {
          if(this.isCalcel) {
            console.log('====================================');
            console.log('download canceled!');
            console.log('====================================');
            break
          }
          this.delegate?.statusChanged(this.videoIndex, i, len, Math.floor(i / len * 100))
          i++;

          if (!fragment.relurl.startsWith('http')) {
              fragment.relurl = urljoin(baseUrl, fragment.relurl)
          }

          console.log('====================================');
          console.log(fragment.relurl);
          console.log('====================================');

          // download
          let ts: undefined | Buffer = undefined
          try {
              ts = await this.downloadBufferTry(fragment.relurl, this.catchVideo.headers)
          } catch(e) {
            this.delegate?.setError(e, this.videoIndex)
            this.isErrorOccured = true
            break
          }

          if(ts) {
              // 暗号化ファイルの解析
              if (fragment.decryptdata && fragment.decryptdata.uri != null && fragment.decryptdata.key == null) {
                  if (uri != fragment.decryptdata.uri) {
                      uri = fragment.decryptdata.uri;
                      key = await this.downloadBufferTry(fragment.decryptdata.uri, this.catchVideo.headers);
                      if(key) {
                          decipher = createDecipheriv('aes-128-cbc', key, fragment.decryptdata.iv);
                      } else {
                          this.delegate?.setError(new Error("Could not get decipher..."), this.videoIndex)
                          this.isErrorOccured = true
                          break
                      }
                  }
                  if(decipher) {
                      ts = decipher.update(ts);
                  } else {
                      this.delegate?.setError(new Error("No decipher exists..."), this.videoIndex)
                      this.isErrorOccured = true
                      break
                  }
              }

              this.tsList.push(ts)
          }
      }
      this.outTS()
      this.delegate?.endDownload(this)
    }
  }
    outTS = () => {
        // out ts
        const concatedBuffer = Buffer.concat(this.tsList)
        let title = this.videoTitle.slice(0, 50) + ".ts"
        const regForFileName = new RegExp('[\\/:*?"<>|]+', 'g');  // 保存不可文字の削除
        title = title.replace(regForFileName, '-');
        if(this.isErrorOccured) {
          title = "(error)" + title
        }
        const savePath = path.join(this.savePath, title)
        console.log('outTS====================================');
        console.log(savePath);
        console.log('====================================');
        fs.writeFileSync(savePath, concatedBuffer)
    }
}