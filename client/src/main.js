import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from '@/router'
import axios from 'axios'
import moment from 'moment'
import store from './store'
import DateTimePicker from 'vuetify-datetime-picker'

Vue.prototype.axios = axios
Vue.prototype.moment = moment
Vue.config.productionTip = false

Vue.use(DateTimePicker)
Vue.use(Vuelidate)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
