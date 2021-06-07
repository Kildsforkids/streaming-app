import {Router} from 'express'
import Log from '../models/Log.js'

const router = Router()

router.get('/logs', async (req, res) => {
    try {
        const logs = await Log.find().populate('user')

        res.json(logs)

    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/logs', async (req, res) => {
    try {
        const {actionType, description, user} = req.body

        const log = new Log({
            actionType, description, user
        })
        await log.save()

        res.status(201).json({ message: 'Совершено действие', log })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

export default router