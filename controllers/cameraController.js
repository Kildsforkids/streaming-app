import Camera from '../models/Camera.js'

class CameraController {
    async getAllCameras() {
        try {
            const cameras = await Camera.find()
            return cameras
        } catch (error) {
            console.error(error)
        }
    }

    async updateCamera(ip, payload) {
        try {
            const {status} = payload

            const camera = await Camera.findOneAndUpdate(
                { ip },
                { status },
                { new: true }
            )

            return camera
            
        } catch (error) {
            console.error(error)
        }
    }
}

export default new CameraController()