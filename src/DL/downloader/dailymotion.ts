import NormalDownloader from "./normal"
import Url from "url"

export default class DailymotionDownloader extends NormalDownloader {
    static matchUrl = new RegExp('dailymotion\\.com')
    static downloaderName = 'Dailymotion'

    interceptRequest = (
        details: Electron.OnBeforeSendHeadersListenerDetails) =>
    {
        console.log('====================================');
        console.log('intercept', details.url);
        console.log('====================================');
        if (details.url.match('https\\://www\\.dailymotion\\.com/cdn/manifest/video/') && details.url.match('.m3u8')) {
            this.delegate?.catchVideo({
                pageUrl: '',
                videoUrl: details.url,
                title: '.ts',
                type: 'HLS',
                headers: details.requestHeaders,
            })
            return
        }
    }

    getBaseUrl = (url: string): string => {
        const parsed = Url.parse(url)
        return parsed.protocol + "//" + parsed.hostname
    }

    run = () => {
        this.downloadHLS()
    }
}