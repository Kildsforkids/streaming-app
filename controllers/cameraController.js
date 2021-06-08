import axios from 'axios'
import Camera from '../models/Camera.js'
import {startHLS} from '../index.js'

export default class CameraController {

    constructor() {
        this.options = {}
    }

    async getAllCameras() {
        try {
            const cameras = await Camera.find()
            return cameras
        } catch (error) {
            console.error(error)
        }
    }

    async updateCamera(ip, payload) {
        try {
            const {status} = payload

            const camera = await Camera.findOneAndUpdate(
                { ip },
                { status },
                { new: true }
            )

            return camera
            
        } catch (error) {
            console.error(error)
        }
    }

    async cameraGetOptions(ip, option) {
        const keyOption = this.options[ip]

        if (keyOption) {
            await axios.post(`http://${ip}:20000/osc/commands/execute`, {
                name: 'camera._getOptions',
                parameters: {
                    property: option
                }
            }, keyOption)
                .then(response => console.log(response.data))
                .catch(error => console.error(error.message))
        }
    }

    async cameraStartPreview(ip) {
        const keyOption = this.options[ip]

        if (keyOption) {
            await axios.post(`http://${ip}:20000/osc/commands/execute`, {
                name: 'camera._startPreview',
                parameters: {
                    origin: {
                        mime: 'h264',
                        width: 1920,
                        height: 1440,
                        framerate: 30,
                        bitrate: 15000
                    },
                    stiching: {
                        mode: 'pano',
                        mime: 'h264',
                        width: 3840,
                        height: 1920,
                        framerate: 30,
                        bitrate: 10240
                    },
                    // audio: {
                    //     mime: 'aac',
                    //     sampleFormat: 's16',
                    //     channelLayout: 'stereo',
                    //     samplerate: 48000,
                    //     bitrate: 128
                    // }
                },
                stabilization: false
            }, keyOption)
                .then(response => {
                    console.log(response.data)
                    startHLS(ip)
                    // setTimeout(cameraStopPreview, 60 * 1000, ip)
                })
                .catch(error => console.error(error.message))
        }
    }

    async cameraStopPreview(ip) {
        const keyOption = this.options[ip]

        if (keyOption) {
            return await axios.post(`http://${ip}:20000/osc/commands/execute`, {
                name: "camera._stopPreview"
            }, keyOption)
        }
    }

    async cameraStopLive(ip) {
        const keyOption = this.options[ip]

        if (keyOption) {
            await axios.post(`http://${ip}:20000/osc/commands/execute`, {
                name: "camera._stopLive"
            }, keyOption)
        }
    }

    async cameraGoLive(ip, streamKey='') {
        const keyOption = this.options[ip]

        if (keyOption) {
            let liveUrl = `rtmp://${ip}/live`
            let _liveUrl = `rtmp://${ip}/live/live`
            if (streamKey) {
                liveUrl = 'rtmp://a.rtmp.youtube.com/live2'
                _liveUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`
            }
            console.log(liveUrl)
            console.log(_liveUrl)
            await axios.post(`http://${ip}:20000/osc/commands/execute`, {
                name: 'camera._startLive',
                parameters: {
                origin: {
                    mime: 'h264',
                    width: 1920,
                    height: 1440,
                    framerate: 30,
                    bitrate: 15000,
                    logMode: 0,
                    // rtmp://a.rtmp.youtube.com/live2
                    liveUrl,//only available in origin live mode, pass rtmp url without stream name. eg. rtmp://127.0.0.1/live
                    saveOrigin: false 
                },
                stiching: { //stitching is only needed in normal mode, do not pass this param for origin live mode
                    mode: 'pano',
                    mime: 'h264',
                    width: 3840,
                    height: 1920,
                    framerate: 30,
                    bitrate: 10240,
                    map: 'equirectangular',
                    // rtmp://a.rtmp.youtube.com/live2/${streamKey}
                    _liveUrl, //rtmp url, like rtmp://127.0.0.1/live/test
                    liveOnHdmi: false, 
                    fileSave: false //save live stream on the camera.
                },
                audio: {
                    mime: 'aac',
                    sampleFormat: 's16',
                    channelLayout: 'stereo',
                    samplerate: 48000,
                    bitrate: 128
                }
                },
                autoConnect: {
                enable: true,
                interval: 20000, // retry delay in ms.
                count: -1 //count = -1 means always try to reconnect
                },
                stabilization: false
            }, keyOption)
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => console.error(error.message))
        }
    }

    async connectCamera(ip, retry=3) {
        if (retry <= 0) {
            setTimeout(() => {
                this.connectCamera(ip)
            }, 60000)
        }
        await axios.post(`http://${ip}:20000/osc/commands/execute`, {
                name: 'camera._connect',
                parameters: {
                    hw_time: '04051020[[20]21][.30]',
                    time_zone: 'Asia/Vladivostok'
                }
            })
            .then(async res => {
                if (res.data.state === 'done') {
                    console.log(`Успешное подключение к ${ip}`)
                    this.updateCamera(ip, { status: 'Активна' })
                    this.options[ip] = {
                        headers: {
                            'Fingerprint': res.data.results.Fingerprint,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
        
                    const statePolling = async () => await axios.post(`http://${ip}:20000/osc/state`, {}, this.options)
                        .then(res => {
                            // console.log('polling')
                            setTimeout(statePolling, 1000)
                        })
                        .catch(error => {
                            // console.error(error)
                            console.log(`Произошла ошибка при получении состояния у ${ip}`)
                            this.updateCamera(ip, { status: 'Неактивна' })
                            setTimeout(() => {
                                this.connectCamera(ip, retry - 1)
                            }, 30000)
                        })
                    
                    statePolling()
    
                    // cameraGetOptions(ip, 'map')
                    await this.cameraStopPreview(ip)
                        .then(async response => {
                            await this.cameraStartPreview(ip)
                        })
                    // cameraGoLive(ip, 'jur7-u7h2-jcwv-t02y-1j1x')
                }
            })
            .catch(error => {
                console.log(`Произошла ошибка соединения с ${ip}, попытка переподключения...`)
                console.log(error.message)
                this.updateCamera(ip, { status: 'Неактивна' })
                setTimeout(() => {
                    this.connectCamera(ip, retry - 1)
                }, 30000)
            })
    }
}