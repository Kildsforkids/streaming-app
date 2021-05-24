import {Router} from 'express'
import Camera from '../models/Camera.js'
import Classroom from '../models/Classroom.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const cameras = await Camera.find().populate('classroom')

        console.log(cameras)

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

export default router