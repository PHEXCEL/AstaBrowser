import NormalDownloader from "./normal"

export default class NicoNicoDownloader extends NormalDownloader {
    static matchUrl = new RegExp('nicovideo\\.jp')
    static downloaderName = 'NicoNico'

    interceptRequest = (
        details: Electron.OnBeforeSendHeadersListenerDetails) =>
    {
        console.log('====================================');
        console.log('intercept', details.url);
        console.log('====================================');
        if (details.url.match('master.m3u8')) {
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

    run = () => {
        this.downloadHLS()
    }
}