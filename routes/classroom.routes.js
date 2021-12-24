import {Router} from 'express'
import Classroom from '../models/Classroom.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const classrooms = await Classroom.find()

        res.json(classrooms)

    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении списка аудиторий', error: error.message })
    }
})
router.post('/', async (req, res) => {
    try {
        const {name} = req.body

        const existing = await Classroom.findOne({ name })

        if (existing) {
            return res.json({ classroom: existing })
        }

        const classroom = new Classroom({
            name
        })

        await classroom.save()

        res.status(201).json({ message: `Аудитория ${name} добавлена`, classroom })

    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении аудитории', error: error.message })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params

        await Classroom.findByIdAndDelete(id)

        res.json({ message: 'Аудитория удалена' })

    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении аудитории', error: error.message })
    }
})

export default router