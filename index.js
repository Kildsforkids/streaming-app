
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import mongoose from 'mongoose'
import google from 'googleapis'
import opn from 'open'
import schedule from 'node-schedule'
import authRouter from './routes/auth.routes.js'
import cameraRouter from './routes/camera.routes.js'
import userRouter from './routes/user.routes.js'
import streamRouter from './routes/stream.routes.js'
import classroomRouter from './routes/classroom.routes.js'
import cameraController from './controllers/cameraController.js'

dotenv.config()

let options = {}

const PORT = process.env.PORT || 5000

const client = {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_url: `http://localhost:${PORT}/api/youtube/auth`,
    scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
}
const oauth2Client = new google.Auth.OAuth2Client(client.id, client.secret, client.redirect_url)
const youtube = new google.youtube_v3.Youtube({ auth: oauth2Client })

const googleAuth = () => {
    const url = oauth2Client.generateAuthUrl({ scope: client.scope })
    opn(url)
}

const getAccessToken = (code) => {
    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            console.log('Error while trying to retrieve access token', err)
            return
        }
        oauth2Client.credentials = tokens
        console.log(tokens)
        // const scheduledStartTime = new Date(2021, 4, 25, 17, 30)
        // insertLiveBroadcast('Testing app', scheduledStartTime)
        //     .then(response => {
        //         console.log('Response', response.data)
        //         insertLiveStream('TestStream')
        //             .then(res => {
        //                 console.log('Stream Response', res.data)
        //                 bindLiveBroadcast(response.data.id, res.data.id)
        //             })
        //             .catch(error => console.log(error.message))
        //     })
        //     .catch(error => {
        //         console.log(error.message.data)
        //     })
        getAllStreams().
            then(response => {
                console.log(response.data)
            })
            .catch(error => console.log(error.message))
    })
}

const getAllBroadcasts = async () => {
    try {
        return await youtube.liveBroadcasts.list({
            part: ['snippet,contentDetails,status'],
            broadcastStatus: 'all',
            access_token: oauth2Client.credentials
        })
    }
    catch (e) {
        console.log(e)
    }
}

const getAllStreams = async () => {
    try {
        return await youtube.liveStreams.list({
            part: ['id,snippet,cdn,status'],
            mine: true,
            access_token: oauth2Client.credentials
        })
    } catch (error) {
        console.log(error.message)
    }
}

const bindLiveBroadcast = async (id, streamId) => {
    try {
        return await youtube.liveBroadcasts.bind({
            part: ['id,snippet,contentDetails,status'],
            id,
            streamId,
            access_token: oauth2Client.credentials
        })
    } catch (error) {
        console.log(error.message)
    }
}

const insertLiveStream = async (title) => {
    try {
        return await youtube.liveStreams.insert({
            part: ['id,snippet,cdn,contentDetails,status'],
            requestBody: {
                snippet: {
                    title
                },
                cdn: {
                    frameRate: '30fps',
                    ingestionType: 'rtmp',
                    resolution: '1080p'
                }
            },
            access_token: oauth2Client.credentials
        })
    } catch (error) {
        console.log(error.message)
    }
}

const deleteLiveStream = async (id) => {
    try {
        return await youtube.liveStreams.delete({
            id,
            access_token: oauth2Client.credentials
        })
    } catch (error) {
        console.log(error.message)
    }
}

const insertLiveBroadcast = async (title, scheduledStartTime, privacyStatus='public') => {
    try {
        return await youtube.liveBroadcasts.insert({
            part: ['id,snippet,contentDetails,status'],
            requestBody: {
                status: {
                    privacyStatus
                },
                snippet: {
                    title,
                    scheduledStartTime
                }
            },
            access_token: oauth2Client.credentials
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteLiveBroadcast = async (id) => {
    try {
        return await youtube.liveBroadcasts.delete({
            id,
            access_token: oauth2Client.credentials
        })
    } catch (error) {
        console.error(error)
    }
}

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/camera', cameraRouter)
app.use('/api/user', userRouter)
app.use('/api/stream', streamRouter)
app.use('/api/classroom', classroomRouter)

app.get('/api/youtube/auth', async (req, res) => {
    const {code} = req.query
    res.send(code)
    if (code)
        getAccessToken(code)
})
app.get('/api/youtube/list', async (req, res) => {
    getAllBroadcasts()
        .then(response => {
            const result = response.data.items
            res.json({ result })
        })
        .catch(error => {
            console.log(error)
            res.status(403).json({ message: "Ошибка" })
        })
})
app.post('/api/youtube/insert', async (req, res) => {
    const {title, scheduledStartTime} = req.body

    insertLiveBroadcast(title, scheduledStartTime)
        .then(response => {
            console.log('Response', response)
            res.json({ response })
        })
        .catch(error => {
            console.log(error)
            res.status(403).json({ message: 'Ошибка' })
        })
})
app.delete('/api/youtube/delete/:id', async (req, res) => {
    const {id} = req.query
    deleteLiveBroadcast(id)
        .then(response => {
            console.log('Response', response)
            res.json({ response })
        })
        .catch(error => {
            console.error(error)
            res.status(403).json({ message: 'Ошибка' })
        })
})
app.post('/api/camera/live/start', async (req, res) => {
    try {
        const {ip} = req.body
        cameraGoLive(ip, 'jur7-u7h2-jcwv-t02y-1j1x')
            .then(response => {
                console.log('Response', response)
                res.json({ response })
            })
        res.json({ message: req.body })
    } catch (error) {
        console.error(error)
        res.status(403).json({ message: 'Ошибка' })
    }
})
app.post('/api/camera/live/stop', async (req, res) => {
    try {
        const {ip} = req.body
        cameraStopLive(ip)
            .then(response => {
                console.log('Response', response)
                res.json({ response })
            })
    } catch (error) {
        console.error(error)
        res.status(403).json({ message: 'Ошибка' })
    }
})

async function cameraGetOptions(ip, option) {
    await axios.post(`http://${ip}:20000/osc/commands/execute`, {
        name: 'camera._getOptions',
        parameters: {
            property: option
        }
    }, options)
        .then(response => console.log(response.data))
        .catch(error => console.error(error.message))
}

async function cameraStartPreview(ip) {
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
    }, options)
        .then(response => {
            console.log(response.data)
            setTimeout(cameraStopPreview, 60 * 1000, ip)
        })
        .catch(error => console.error(error.message))
}

async function cameraStopPreview(ip) {
    await axios.post(`http://${ip}:20000/osc/commands/execute`, {
        name: 'camera._stopPreview'
    }, options)
        .then(response => console.log(response.data))
        .catch(error => console.error(error.message))
}

async function cameraStopLive(ip) {
    await axios.post(`http://${ip}:20000/osc/commands/execute`, {
        name: "camera._stopLive"
    }, options)
}

async function cameraGoLive(ip, streamKey) {
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
            setTimeout(cameraStopLive, 2 * 60 * 1000, ip)
        })
        .catch(error => console.error(error.message))
}

async function connectCamera(ip, retry=3) {
    if (retry <= 0) {
        cameraController.updateCamera(ip, { status: 'Неактивна' })
        setTimeout(connectCamera, 60000, ip)
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
                cameraController.updateCamera(ip, { status: 'Активна' })
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
                        setTimeout(connectCamera, 30000, ip, retry - 1)
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
            setTimeout(connectCamera, 30000, ip, retry - 1)
        })
}

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        // const tokens = {
        //     access_token: process.env.GOOGLE_TOKEN,
        //     scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl',
        //     token_type: 'Bearer',
        //     expiry_date: 1621902314985
        // }
        // oauth2Client.credentials = tokens
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}...`))
    } catch (error) {
        console.error(error)
    }
}

start()
// googleAuth()
// connectCamera('192.168.1.188')
//     .then(() => {
//         const date = new Date(2021, 4, 25, 16, 58)
//         const job = schedule.scheduleJob(date, () => {
//             cameraStartPreview('192.168.1.188')
//         })
//     })
// cameraController.getAllCameras()
//     .then(response => {
//         response.map(camera => {
//             console.log(camera.ip)
//             connectCamera(camera.ip)
//         })
//     })
//     .catch(error => console.error(error))