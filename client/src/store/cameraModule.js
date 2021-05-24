import axios from 'axios'

export default {
    state: {
        cameras: [],
        classrooms: [],
        streams: []
    },
    mutations: {
        setCameras(state, payload) {
            state.cameras = payload
        },
        setClassrooms(state, payload) {
            state.classrooms = payload
        },
        setStreams(state, payload) {
            state.streams = payload
        }
    },
    getters: {
        getAllCameras(state) {
            return state.cameras
        },
        getAllClassrooms(state) {
            return state.classrooms
        },
        getAllStreams(state) {
            return state.streams
        }
    },
    actions: {
        async fetchCameras(context) {
            await axios.get('http://localhost:5000/api/camera')
                .then(response => {
                    // console.log(response.data)
                    context.commit('setCameras', response.data)
                })
                .catch(error => console.error(error))
        },
        async fetchClassrooms(context) {
            await axios.get('http://localhost:5000/api/classroom')
                .then(response => {
                    // console.log(response.data)
                    context.commit('setClassrooms', response.data)
                })
                .catch(error => console.error(error))
        },
        async fetchStreams(context) {
            await axios.get('http://localhost:5000/api/stream')
                .then(response => {
                    context.commit('setStreams', response.data)
                })
                .catch(error => console.error(error))
        }
    }
}