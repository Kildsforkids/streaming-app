<template>
  <v-data-table
    :headers="headers"
    :items="logs"
    :items-per-page="5"
    class="elevation-1">
  </v-data-table>
</template>

<script>
export default {
    name: 'LogsTable',
    data: () => ({
        headers: [
          {
            text: 'Время',
            align: 'start',
            value: 'time',
          },
          { text: 'Пользователь', value: 'user' },
          { text: 'Событие', value: 'actionType' },
          { text: 'Описание', value: 'description' }
        ],
        logs: []
    }),
    created() {
      this.initialize()
    },
    methods: {
      initialize() {
        this.logs = [
          {
            time: this.getTimeNow,
            user: 'keeper1',
            actionType: 'Создание нового события',
            description: ''
          },
          {
            time: this.getTimeNow,
            user: 'keeper1',
            actionType: 'Удаление события',
            description: 'Новая запланированная трансляция'
          }
        ]
      }
    },
    computed: {
      getTimeNow() {
        return this.moment().format('DD.MM.YY, HH:mm')
      }
    }
}
</script>