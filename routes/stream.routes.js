import {Router} from 'express'
import StreamModel from '../models/Stream.js'
import StreamController from '../controllers/StreamController.js'

const router = Router()
// const client = {
//     id: process.env.GOOGLE_CLIENT_ID,
//     secret: process.env.GOOGLE_CLIENT_SECRET,
//     redirect_url: `http://localhost:${process.env.PORT}/api/stream/auth`,
//     scope: [
//         'https://www.googleapis.com/auth/youtube',
//         'https://www.googleapis.com/auth/youtube.readonly',
//         'https://www.googleapis.com/auth/youtube.force-ssl'
//     ]
// }
const streamController = new StreamController()

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
    const {id} = req.query
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