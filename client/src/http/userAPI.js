import {$host, $authHost} from './index'
import jwt_decode from 'jwt-decode'

export const login = async (login, password) => {
    const {data} = await $host.post('api/auth/login', {
        login, password
    })
    // console.log(data)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', data.userId)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/auth/check')
    localStorage.setItem('token', data.token)
    return data
}

export const createLog = async (actionType, description) => {
    const user = localStorage.getItem('user')
    const response = await $authHost.post('api/user/logs', {
        user, actionType, description
    })
    return response
}