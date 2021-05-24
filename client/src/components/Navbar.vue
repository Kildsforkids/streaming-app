<template>
  <v-container fluid>
    <v-app-bar
        color="blue"
        dark
      >
      <v-toolbar-title>Управление трансляциями</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="ml-3" to="/">Трансляции</v-btn>
      <v-btn text class="ml-3" to="/settings">Настройки</v-btn>
      <v-btn text class="ml-3" to="/archive">Архив</v-btn>
      <v-btn outlined class="ml-3">Выйти</v-btn>
    </v-app-bar>
  </v-container>
</template>

<script>
export default {
    name: 'Navbar',
}
</script>