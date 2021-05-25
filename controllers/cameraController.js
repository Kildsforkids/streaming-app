import axios from 'axios'
import Camera from '../models/Camera.js'

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
        await axios.post(`http://${ip}:20000/osc/commands/execute`, {
            name: 'camera._getOptions',
            parameters: {
                property: option
            }
        }, this.options)
            .then(response => console.log(response.data))
            .catch(error => console.error(error.message))
    }

    async cameraStartPreview(ip) {
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
        }, this.options)
            .then(response => {
                console.log(response.data)
                setTimeout(cameraStopPreview, 60 * 1000, ip)
            })
            .catch(error => console.error(error.message))
    }

    async cameraStopLive(ip) {
        await axios.post(`http://${ip}:20000/osc/commands/execute`, {
            name: "camera._stopLive"
        }, this.options)
    }

    async cameraGoLive(ip, streamKey) {
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
                liveUrl: 'rtmp://192.168.1.188/live',//only available in origin live mode, pass rtmp url without stream name. eg. rtmp://127.0.0.1/live
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
                _liveUrl: `rtmp://192.168.1.188/live/live`, //rtmp url, like rtmp://127.0.0.1/live/test
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
        }, options)
            .then(response => {
                console.log(response.data)
                setTimeout(this.cameraStopLive, 2 * 60 * 1000, ip)
            })
            .catch(error => console.error(error.message))
    }

    async connectCamera(ip, retry=3) {
        if (retry <= 0) {
            this.updateCamera(ip, { status: 'Неактивна' })
            setTimeout(this.connectCamera, 60000, ip)
        }
        await axios.post(`http://${ip}:20000/osc/commands/execute`, {
                name: 'camera._connect',
                parameters: {
                    hw_time: '04051020[[20]21][.30]',
                    time_zone: 'Asia/Vladivostok'
                }
            })
            .then(res => {
                if (res.data.state === 'done') {
                    console.log(`Успешное подключение к ${ip}`)
                    this.updateCamera(ip, { status: 'Активна' })
                    options = {
                        headers: {
                            'Fingerprint': res.data.results.Fingerprint,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
        
                    const statePolling = async () => await axios.post(`http://${ip}:20000/osc/state`, {}, options)
                        .then(res => {
                            // console.log('polling')
                            setTimeout(statePolling, 1000)
                        })
                        .catch(error => {
                            // console.error(error)
                            console.log(`Произошла ошибка при получении состояния у ${ip}`)
                            // cameraController.updateCamera(ip, { status: 'Неактивна' })
                            setTimeout(this.connectCamera, 30000, ip, retry - 1)
                        })
                    
                    statePolling()
    
                    // cameraGetOptions(ip, 'map')
                    // cameraStartPreview(ip)
                    // cameraGoLive(ip, 'jur7-u7h2-jcwv-t02y-1j1x')
                }
            })
            .catch(error => {
                // console.error(error)
                console.log(`Произошла ошибка соединения с ${ip}, попытка переподключения...`)
                console.log(error.message)
                setTimeout(this.connectCamera, 30000, ip, retry - 1)
            })
    }
}