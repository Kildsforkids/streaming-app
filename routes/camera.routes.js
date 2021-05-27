import {Router} from 'express'
import Camera from '../models/Camera.js'
import CameraController from '../controllers/CameraController.js'

const router = Router()
const cameraController = new CameraController()

router.get('/', async (req, res) => {
    try {
        const cameras = await Camera.find().populate('classroom')

        // console.log(cameras)

        res.json(cameras)

    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.post('/', async(req, res) => {
    try {
        const {ip, classroom} = req.body

        const existing = await Camera.findOne({ ip })

        if (existing) {
            return res.json({ camera: existing })
        }

        const camera = new Camera({
            ip, classroom
        })

        await camera.save()

        res.status(201).json({ message: 'Камера добавлена', camera })

    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.post('/live/start', async (req, res) => {
    try {
        const {ip} = req.body
        cameraController.cameraGoLive(ip, 'jur7-u7h2-jcwv-t02y-1j1x')
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
router.post('/live/stop', async (req, res) => {
    try {
        const {ip} = req.body
        cameraController.cameraStopLive(ip)
            .then(response => {
                console.log('Response', response)
                res.json({ response })
            })
    } catch (error) {
        console.error(error)
        res.status(403).json({ message: 'Ошибка' })
    }
})

export { router, cameraController }