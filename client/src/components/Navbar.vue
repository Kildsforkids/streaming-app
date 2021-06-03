<template>
  <v-container>
    <v-app-bar
        flat>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-bold">Управление трансляциями</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="ml-3" to="/">Трансляции</v-btn>
      <v-btn text class="ml-3" to="/settings">Настройки</v-btn>
      <v-btn text class="ml-3" to="/archive">Архив</v-btn>
      <v-btn outlined class="ml-3">
        <span>Выйти</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
  </v-container>
</template>

<script>
export default {
    name: 'Navbar',
}
</script>