<template>
  <v-container class="fill-height">
    <v-row
      justify="center">
      <v-col cols="6">
        <h1>Авторизация</h1>
        <v-text-field
          label="Логин"
          :rules="rules"
          v-model="login">
        </v-text-field>
        <v-text-field
          label="Пароль"
          :rules="rules"
          type="password"
          v-model="password">
        </v-text-field>
        <v-row class="mt-5" justify="end">
          <v-btn
            elevation="2"
            @click="submit"
            color="primary">
            Войти
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar
        v-model="snackbar.active"
        timeout="5000">
        {{ snackbar.text }}

        <template v-slot:action="{ attrs }">
            <v-btn
                color="blue"
                text
                v-bind="attrs"
                @click="snackbar.active = false">
                Закрыть
            </v-btn>
        </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import {login, check} from '../http/userAPI'

export default {
  name: 'AuthPage',
  data: () => ({
    rules: [
      value => !!value || 'Поле не должно быть пустым'
    ],
    login: '',
    password: '',
    snackbar: {
      active: false,
      text: ''
    }
  }),
  // mounted() {
  //   this.checkUser()
  // },
  methods: {
    async submit() {
      await login(this.login, this.password)
        .then(async response => {
          console.log(response)
          this.$store.commit('setIsAuth', true)
          await this.$router.push('/')
        })
        .catch(error => {
          const message = error.response.data.message
          console.log(message)
          this.showSnack(message)
        })
    },
    async showSnack(text) {
      this.snackbar.text = text
      this.snackbar.active = true
    },
    // async checkUser() {
    //   await check()
    //     .then(async data => {
    //         this.$store.commit('setIsAuth', true)
    //         await this.$router.push('/')
    //     })
    // }
  }
}
</script>