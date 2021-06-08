// import axios from 'axios'
import {$authHost} from '../http'

export default {
    state: {
        cameras: [],
        classrooms: [],
        streams: [],
        logs: [],
        user: '',
        isAuth: false
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
        },
        setLogs(state, payload) {
            state.logs = payload
        },
        setUser(state, payload) {
            state.user = payload
        },
        setIsAuth(state, payload) {
            state.isAuth = payload
        },
        addCamera(state, payload) {
            state.cameras.push(payload)
        },
        deleteCamera(state, payload) {
            const index = state.cameras.indexOf(payload)
            if (index !== -1)
                state.cameras.splice(index, 1)
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
        },
        getAllLogs(state) {
            return state.logs
        },
        getUser(state) {
            return state.user
        },
        getIsAuth(state) {
            return state.isAuth
        }
    },
    actions: {
        async fetchCameras(context) {
            await $authHost.get('api/camera')
                .then(response => {
                    // console.log(response.data)
                    context.commit('setCameras', response.data)
                })
                .catch(error => console.error(error))
        },
        async fetchClassrooms(context) {
            await $authHost.get('api/classroom')
                .then(response => {
                    // console.log(response.data)
                    context.commit('setClassrooms', response.data)
                })
                .catch(error => console.error(error))
        },
        async fetchStreams(context) {
            await $authHost.get('api/stream')
                .then(response => {
                    // console.log(response.data)
                    context.commit('setStreams', response.data)
                })
                .catch(error => console.error(error))
        },
        async fetchLogs(context) {
            await $authHost.get('api/user/logs')
                .then(response => {
                    // console.log(response.data)
                    context.commit('setLogs', response.data)
                })
                .catch(error => console.error(error))
        }
    }
}