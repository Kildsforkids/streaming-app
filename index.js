
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './routes/auth.routes.js'
import authMiddleware from './middleware/authMiddleware.js'
import { router as cameraRouter, cameraController } from './routes/camera.routes.js'
import userRouter from './routes/user.routes.js'
import { router as streamRouter, streamController } from './routes/stream.routes.js'
import classroomRouter from './routes/classroom.routes.js'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'

dotenv.config()

const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public', 'videos')))
app.use('/api/auth', authRouter)
app.use('/api/camera', authMiddleware, cameraRouter)
app.use('/api/user', authMiddleware, userRouter)
app.use('/api/stream', streamRouter)
app.use('/api/classroom', authMiddleware, classroomRouter)
app.get('/preview', async (req, res) => {
    const {ip} = req.query
    const fileName = `${ip}.m3u8`
    const filePath = path.join(__dirname, 'public', 'videos', fileName)
    fs.stat(filePath, (error, stats) => {
        if (error) {
            console.log(`[server] file ${fileName} doesn\'t exist`)
            res.end()
        } else {
            res.sendFile(filePath, error => {
                if (error) {
                    console.log('[preview] ' + error + '\n' + filePath)
                    res.end()
                }
            })
        }
    })
})

export function startHLS(host) {
    ffmpeg(`rtmp://${host}:1935/live/preview`, { timeout: 432000 })
    .addOptions([
        '-c:v libx264',
        '-c:a aac',
        '-ac 1',
        '-strict -2',
        '-crf 18',
        '-profile:v baseline',
        '-maxrate 400k',
        '-bufsize 1835k',
        '-pix_fmt yuv420p',
        '-hls_time 10',
        '-hls_list_size 6',
        // '-hls_wrap 10',
        '-start_number 1'
    ])
    .on('start', commandLine => {
        console.log('[ffmpeg] Spawned Ffmpeg with command: ' + commandLine)
    })
    .on('end', () => {
        console.log('[ffmpeg] Finished processing')
    })
    .on('error', (error, stdout, stderr) => {
        console.log('[ffmpeg] ' + error.message)
    })
    .output(`./public/videos/${host}.m3u8`)
    .run()
}

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => console.log(`[server] Сервер запущен на порту ${PORT}...`))
    } catch (error) {
        console.error('[server] ' + error)
    }
}

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
cameraController.getAllCameras()
    .then(response => {
        response.map(camera => {
            console.log('[server] found camera ' + camera.ip)
            cameraController.connectCamera(camera.ip)
        })
    })
    .catch(error => console.error('[camera_controller] ' + error))
// cameraController.connectCamera('192.168.0.103')
streamController.googleAuth()