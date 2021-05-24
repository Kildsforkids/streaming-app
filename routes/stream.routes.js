import {Router} from 'express'
import StreamModel from '../models/Stream.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const streams = await StreamModel.find().populate('camera')

        res.json(streams)

    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.post('/', async(req, res) => {
    try {
        const {name, start, end, camera} = req.body

        const stream = new StreamModel({
            name, start, end, camera
        })

        await stream.save()

        res.status(201).json({ message: 'Событие добавлено', stream })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

export default router