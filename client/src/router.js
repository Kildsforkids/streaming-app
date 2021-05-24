import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '@/pages/MainPage'
import AuthPage from '@/pages/AuthPage'
import SettingsPage from '@/pages/SettingsPage'
import ArchivePage from '@/pages/ArchivePage'

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
        }
    ]
})

router.beforeEach((to, from, next) => {
    const requireAuth = to.matched.some(record => record.meta.auth)

    if (requireAuth && false) {
        next('/auth')
    } else {
        next()
    }
})

export default router