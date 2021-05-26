import {Router} from 'express'
import StreamModel from '../models/Stream.js'
import StreamController from '../controllers/StreamController.js'
import { createJob, cancelJob } from '../controllers/JobController.js'

const router = Router()
const streamController = new StreamController()

router.get('/', async (req, res) => {
    try {
        const streams = await StreamModel.find().populate({
            path: 'camera',
            populate: {
                path: 'classroom'
            }
        })

        res.json(streams)

    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.post('/', async(req, res) => {
    try {
        const {name, start, end, camera, id} = req.body

        if (id) {
            await streamController.updateStream(id, { name, start, end, camera })
                .then(response => {
                    // cancelJob(id + '-start')
                    console.log(response)
                    // createJob()
                    res.json({ message: 'Событие обновлено', response })
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).json({ message: 'Не удалось обновить данные' })
                })
        } else {
            const stream = new StreamModel({
                name, start, end, camera: camera._id
            })
    
            await stream.save()
            //     .then(response => {
            //         console.log(response.populate({
            //             path: 'camera',
            //             populate: {
            //                 path: 'classroom'
            //             }
            //         }))
            //     })

            // stream = stream.populate({
            //     path: 'camera',
            //     populate: {
            //         path: 'classroom'
            //     }
            // })

            // createJob(stream._id + '-start', start, streamController.insertLiveBroadcast, [name, start])
            createJob(stream._id + '-start', start, () => console.log('hello'))

            res.status(201).json({ message: 'Событие добавлено', stream })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params
        await StreamModel.findByIdAndDelete(id)

        cancelJob(id + '-start')

        res.json({ message: 'Событие удалено' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.get('/auth', async (req, res) => {
    const {code} = req.query
    res.send(code)
    if (code)
        streamController.getAccessToken(code)
})
router.get('/list', async (req, res) => {
    streamController.getAllBroadcasts()
        .then(response => {
            const result = response.data.items
            res.json({ result })
        })
        .catch(error => {
            console.log(error)
            res.status(403).json({ message: "Ошибка" })
        })
})
router.post('/insert', async (req, res) => {
    const {title, scheduledStartTime} = req.body
    streamController.insertLiveBroadcast(title, scheduledStartTime)
        .then(response => {
            console.log('Response', response)
            res.json({ response })
        })
        .catch(error => {
            console.log(error.message)
            res.status(403).json({ message: 'Ошибка' })
        })
})
router.delete('/delete/:id', async (req, res) => {
    const {id} = req.params
    streamController.deleteLiveBroadcast(id)
        .then(response => {
            console.log('Response', response)
            res.json({ response })
        })
        .catch(error => {
            console.error(error.message)
            res.status(403).json({ message: 'Ошибка' })
        })
})

export { router, streamController }