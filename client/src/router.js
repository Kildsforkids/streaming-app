import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '@/pages/MainPage'
import AuthPage from '@/pages/AuthPage'
import SettingsPage from '@/pages/SettingsPage'
import ArchivePage from '@/pages/ArchivePage'
import store from './store'
import {check} from './http/userAPI'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            meta: {auth: true},
            component: MainPage
        },
        {
            path: '/auth',
            component: AuthPage
        },
        {
            path: '/settings',
            meta: {auth: true},
            component: SettingsPage
        },
        {
            path: '/archive',
            meta: {auth: true},
            component: ArchivePage
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const requireAuth = to.matched.some(record => record.meta.auth)

    if (requireAuth && !store.getters.getIsAuth) {
        await check()
            .then(data => {
                // console.log(data)
                store.commit('setIsAuth', true)
            })
            .catch(error => {
                next('/auth')
            })
    }
    next()
})

export default router