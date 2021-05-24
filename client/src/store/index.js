import Vue from 'vue'
import Vuex from 'vuex'
import cameraModule from '@/store/cameraModule'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        cameraModule
    }
})