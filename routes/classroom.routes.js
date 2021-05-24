import {Router} from 'express'
import Classroom from '../models/Classroom.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const classrooms = await Classroom.find()

        res.json(classrooms)

    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.post('/', async(req, res) => {
    try {
        console.log(req.body)
        const {name} = req.body

        const existing = await Classroom.findOne({ name })

        if (existing) {
            return res.json({ classroom: existing })
        }

        const classroom = new Classroom({
            name
        })

        await classroom.save()

        res.status(201).json({ message: 'Аудитория добавлена', classroom })

    } catch (error) {
        // console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

export default router