
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
// import axios from 'axios'
import mongoose from 'mongoose'
// import schedule from 'node-schedule'
import authRouter from './routes/auth.routes.js'
import { router as cameraRouter, cameraController } from './routes/camera.routes.js'
import userRouter from './routes/user.routes.js'
import { router as streamRouter, streamController } from './routes/stream.routes.js'
import classroomRouter from './routes/classroom.routes.js'
// import CameraController from './controllers/CameraController.js'
// import StreamController from './controllers/StreamController.js'

dotenv.config()

const PORT = process.env.PORT || 5000

// const client = {
//     id: process.env.GOOGLE_CLIENT_ID,
//     secret: process.env.GOOGLE_CLIENT_SECRET,
//     redirect_url: `http://localhost:${PORT}/api/youtube/auth`,
//     scope: [
//         'https://www.googleapis.com/auth/youtube',
//         'https://www.googleapis.com/auth/youtube.readonly',
//         'https://www.googleapis.com/auth/youtube.force-ssl'
//     ]
// }
// const streamController = new StreamController(client)
// const cameraController = new CameraController()

// const createJob = async (id, date, worker, params) => {
//     try {
//         schedule.scheduleJob(id, date, () => {
//             worker(...params)
//         })
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const cancelJob = async (id) => {
//     try {
//         return schedule.cancelJob(id)
//     } catch (error) {
//         console.log(error.message)
//     }
// }

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/camera', cameraRouter)
app.use('/api/user', userRouter)
app.use('/api/stream', streamRouter)
app.use('/api/classroom', classroomRouter)

// app.get('/api/youtube/auth', async (req, res) => {
//     const {code} = req.query
//     res.send(code)
//     if (code)
//         streamController.getAccessToken(code)
// })
// app.get('/api/youtube/list', async (req, res) => {
//     streamController.getAllBroadcasts()
//         .then(response => {
//             const result = response.data.items
//             res.json({ result })
//         })
//         .catch(error => {
//             console.log(error)
//             res.status(403).json({ message: "Ошибка" })
//         })
// })
// app.post('/api/youtube/insert', async (req, res) => {
//     const {title, scheduledStartTime} = req.body
//     streamController.insertLiveBroadcast(title, scheduledStartTime)
//         .then(response => {
//             console.log('Response', response)
//             res.json({ response })
//         })
//         .catch(error => {
//             console.log(error.message)
//             res.status(403).json({ message: 'Ошибка' })
//         })
// })
// app.delete('/api/youtube/delete/:id', async (req, res) => {
//     const {id} = req.query
//     streamController.deleteLiveBroadcast(id)
//         .then(response => {
//             console.log('Response', response)
//             res.json({ response })
//         })
//         .catch(error => {
//             console.error(error.message)
//             res.status(403).json({ message: 'Ошибка' })
//         })
// })
// app.post('/api/camera/live/start', async (req, res) => {
//     try {
//         const {ip} = req.body
//         cameraController.cameraGoLive(ip, 'jur7-u7h2-jcwv-t02y-1j1x')
//             .then(response => {
//                 console.log('Response', response)
//                 res.json({ response })
//             })
//         res.json({ message: req.body })
//     } catch (error) {
//         console.error(error)
//         res.status(403).json({ message: 'Ошибка' })
//     }
// })
// app.post('/api/camera/live/stop', async (req, res) => {
//     try {
//         const {ip} = req.body
//         cameraController.cameraStopLive(ip)
//             .then(response => {
//                 console.log('Response', response)
//                 res.json({ response })
//             })
//     } catch (error) {
//         console.error(error)
//         res.status(403).json({ message: 'Ошибка' })
//     }
// })

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

// async function hello(msg) {
//     try {
//         console.log(msg)
//     } catch (error) {
//         console.error(error)
//     }
// }

const client = {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_url: `http://localhost:${process.env.PORT}/api/stream/auth`,
    scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
}

streamController.setClient(client)

start()
// streamController.googleAuth()
// cameraController.getAllCameras()
//     .then(response => {
//         response.map(camera => {
//             console.log(camera.ip)
//             cameraController.connectCamera(camera.ip)
//         })
//     })
//     .catch(error => console.error(error))
// streamController.googleAuth()
// const date = new Date(2021, 4, 25, 23, 22)
// createJob('1', date, hello, ['hello'])
// setTimeout(() => {
//     if (cancelJob('1')) {
//         console.log('YES')
//     } else {
//         console.log('NO')
//     }
// }, 10000)
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