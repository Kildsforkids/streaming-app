<template>
  <v-container>
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
    <v-btn
      elevation="2"
      @click="submit">
      Войти
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'AuthPage',
  data: () => ({
    rules: [
      value => !!value || 'Поле не должно быть пустым'
    ],
    login: '',
    password: ''
  }),
  methods: {
    async submit() {
      await this.axios.post('http://localhost:5000/api/auth/login', {
        login: this.login,
        password: this.password
      })
      .then(response => console.log(response))
      .catch(error => console.error(error))
      await this.$router.push('/')
    }
  }
}
</script>