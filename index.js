
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import mongoose from 'mongoose'
import google from 'googleapis'
import opn from 'open'
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
    })
}

const getAllStreams = async () => {
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

const insertLiveBroadcast = async () => {
    try {
        return await youtube.liveBroadcasts.insert({
            part: 'id,snippet,contentDetails,status',
            requestBody: {
                status: {
                    privacyStatus: 'public'
                },
                snippet: {
                    title: 'Test Broadcast',
                    scheduledStartTime: new Date('2021-05-24T10:00:00')
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
    getAllStreams()
        .then(response => {
            // const result = response.data.items.map(item => item.id)
            const result = response.data.items
            res.json({ result })
        })
        .catch(error => {
            console.log(error)
            res.status(403).json({ message: "Ошибка" })
        })
})
app.post('/api/youtube/insert', async (req, res) => {
    insertLiveBroadcast()
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
app.post('/api/camera/start', async (req, res) => {
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
app.post('/api/camera/stop', async (req, res) => {
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

async function cameraStopLive(ip) {
    await axios.post(`http://${ip}:2000/osc/commands/execute`, {
        name: "camera._stopLive"
    })
}

async function cameraGoLive(ip, streamKey) {
    const string = ''
    const int = 0
    await axios.post(`http://${ip}:20000/osc/commands/execute`, {
            name: "camera._startLive",
            parameters: {
              "origin":{
                // "mime": string,
                "width": 3840,
                "height": 1920,
                "framerate": 30,
                "bitrate": 15,
                // "logMode": int, 
                "liveUrl": 'rtmp://a.rtmp.youtube.com/live2',//only available in origin live mode, pass rtmp url without stream name. eg. rtmp://127.0.0.1/live
                "saveOrigin": false 
              },
              "stiching":{ //stitching is only needed in normal mode, do not pass this param for origin live mode
                "mode": 'normal',
                // "mime": string,
                "width": 3840,
                "height": 1920,
                "framerate":30,
                "bitrate": 15,
                // "map": string, 
                "_liveUrl": `rtmp://a.rtmp.youtube.com/live2/${streamKey}`, //rtmp url, like rtmp://127.0.0.1/live/test
                "liveOnHdmi": false, 
                "fileSave": false //save live stream on the camera.
              },
              "audio":{
                // "mime":string,
                // "sampleFormat":string,
                // "channelLayout":string,
                // "samplerate":int,
                "bitrate": 15
              }
            },
            "autoConnect": {
              "enable": true,
              "interval": 20000, // retry delay in ms.
              "count": -1 //count = -1 means always try to reconnect
            },
            stabilization: false
    }, options)
        .then(response => console.log(response))
        .catch(error => console.error(error))
}

async function connectCamera(ip) {
    await axios.post(`http://${ip}:20000/osc/commands/execute`, {
            name: 'camera._connect',
            parameters: {
                hw_time: '04051020[[20]21][.30]',
                time_zone: 'Asia/Vladivostok'
            }
        })
        .then(res => {
            if (res.data.state === 'done') {
                console.log('yes')
                cameraController.updateCamera(ip, { status: 'Активна' })
                options = {
                    headers: {
                        'Fingerprint': res.data.results.Fingerprint,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
    
                const statePolling = () => axios.post(`http://${ip}:20000/osc/state`, {}, options)
                    .then(res => {
                        console.log('polling')
                        setTimeout(statePolling, 1000)
                    })
                    .catch(error => {
                        console.error(error)
                        cameraController.updateCamera(ip, { status: 'Неактивна' })
                    })
                
                statePolling()
            }
        })
        .catch(error => {
            console.error(error)
        })
}

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        })
        app.listen(PORT, () => console.log(`Server is runnning on port ${PORT}...`))
    } catch (error) {
        console.error(error)
    }
}

start()
// googleAuth()
// connectCamera('192.168.1.188')
// cameraController.getAllCameras()
//     .then(response => {
//         response.map(camera => {
//             console.log(camera.ip)
//             connectCamera(camera.ip)
//         })
//     })
//     .catch(error => console.error(error))