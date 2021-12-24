import {Router} from 'express'
import StreamModel from '../models/Stream.js'
import StreamController from '../controllers/StreamController.js'
import { cameraController } from './camera.routes.js'
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
router.post('/', async (req, res) => {
    try {
        const {name, start, end, camera, id} = req.body

        const startsIn = await StreamModel.findOne({
            camera,
            start: {
                $gte: start,
                $lt: end
            }
        })
        const endsIn = await StreamModel.findOne({
            camera,
            end: {
                $gte: start,
                $lt: end
            }
        })

        if (startsIn || endsIn) {
            console.log('Уже есть запланированная трансляция на данный период')
            return res.json({ message: 'Уже есть запланированная трансляция на этот период' })
        }

        if (id) {
            streamController.updateStream(id, { name, start, end, camera })
                .then(response => {
                    cancelJob(id + '-start')
                        .then(() => {
                            createJob(id + '-start', start, (title, scheduledStartTime) => {
                                streamController.insertLiveBroadcast(title, scheduledStartTime)
                                    .then(response => {
                                        cameraController.cameraGoLive(camera.ip, 'jur7-u7h2-jcwv-t02y-1j1x')
                                            .then(async () => {
                                                await streamController.updateStreamStatus(id, 'Идет')
                                                // await streamController.setStreamLink(id, 'complete')
                                            })
                                    })
                            }, [name, start])
                        })
                    cancelJob(id + '-end')
                        .then(() => {
                            createJob(id + '-end', end, () => {
                                cameraController.cameraStopLive(camera.ip)
                                    .finally(() => {
                                        streamController.updateStreamStatus(id, 'Завершена')
                                        streamController.setBroadcastStatus(id, )
                                    })
                            })
                        })
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

            cancelJob(stream._id + '-start')
                .then(() => {
                    createJob(stream._id + '-start', start, (title, scheduledStartTime) => {
                        streamController.insertLiveBroadcast(title, scheduledStartTime)
                            .then(async response => {
                                // console.log(response.data)
                                const streamID = response.data.id
                                console.log('[stream_router] stream: ' + streamID)

                                // await cameraController.cameraGoLive(camera.ip, 'jur7-u7h2-jcwv-t02y-1j1x')
                                //     .then(() => {
                                //         streamController.updateStreamStatus(stream._id, 'Идет')
                                //     })
                                await cameraController.cameraStopPreview(camera.ip)
                                    .then(response => {
                                        setTimeout(() => {
                                            cameraController.cameraGoLive(camera.ip, 'jur7-u7h2-jcwv-t02y-1j1x')
                                                .then(() => {
                                                    streamController.updateStreamStatus(stream._id, 'Идет')
                                                })
                                        }, 10000)
                                    })
                            })
                    }, [name, start])
                })
            cancelJob(stream._id + '-end')
                .then(() => {
                    createJob(stream._id + '-end', end, () => {
                        cameraController.cameraStopLive(camera.ip)
                            .then(() => {
                                streamController.updateStreamStatus(stream._id, 'Завершена')
                                cameraController.cameraStartPreview(camera.ip)
                            })
                    })
                })

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
        cancelJob(id + '-end')

        res.json({ message: 'Событие удалено' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.get('/auth', async (req, res) => {
    const {code} = req.query
    res.send('Success')
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
            res.status(403).json({ message: 'Ошибка при получении списка запланированных событий', error: error.message })
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
            res.status(403).json({ message: 'Ошибка при создании нового запланированного события', error: error.message })
        })
})
// router.post('/bind', async (req, res) => {
//     const {id} = req.body
//     streamController.bindLiveBroadcast(id, streamId)
// })
router.post('/:id/stop', async (req, res) => {
    const {id} = req.params
    streamController.setBroadcastStatus(id, 'complete')
        .then(response => {
            console.log('Response', response)
            res.json({ response })
        })
        .catch(error => {
            console.error(error.message)
            res.status(403).json({ message: 'Ошибка при завершении трансляции', error: error.message })
        })
})
router.post('/:id/pause', async (req, res) => {
    const {id} = req.params
    streamController.setBroadcastStatus(id, 'testing')
        .then(response => {
            console.log('Response', response)
            res.json({ response })
        })
        .catch(error => {
            console.error(error.message)
            res.status(403).json({ message: 'Ошибка при приостановке трансляции', error: error.message })
        })
})
router.post('/:id/resume', async (req, res) => {
    const {id} = req.params
    streamController.setBroadcastStatus(id, 'live')
        .then(response => {
            console.log('Response', response)
            res.json({ response })
        })
        .catch(error => {
            console.error(error.message)
            res.status(403).json({ message: 'Ошибка при возобновлении трансляции', error: error.message })
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
            res.status(403).json({ message: 'Ошибка при удалении трансляции', error: error.message })
        })
})
router.get('/streams', async (req, res) => {
    streamController.getAllStreams()
        .then(response => {
            res.json({ data: response.data })
        })
        .catch(error => {
            console.log(error.message)
            res.status(403).json({ message: 'Ошибка при получении всех трансляций', error: error.message })
        })
})

export { router, streamController }