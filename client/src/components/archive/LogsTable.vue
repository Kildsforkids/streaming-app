<template>
  <div>
    <v-row>
      <v-col>
        <v-datetime-picker
          label="Начало периода"
          clearText="Сбросить"
          okText="ОК"
          :datePickerProps="datePickerProps"
          :timePickerProps="timePickerProps"
          v-model="filterStart">
          <template slot="dateIcon">
            Дата
            <!-- <v-icon>fas fa-calendar</v-icon> -->
          </template>
          <template slot="timeIcon">
            Время
            <!-- <v-icon>fas fa-clock</v-icon> -->
          </template>
        </v-datetime-picker>
      </v-col>
      <v-col>
        <v-datetime-picker
          label="Конец периода"
          clearText="Сбросить"
          okText="ОК"
          :datePickerProps="datePickerProps"
          :timePickerProps="timePickerProps"
          v-model="filterEnd">
          <template slot="dateIcon">
            Дата
            <!-- <v-icon>fas fa-calendar</v-icon> -->
          </template>
          <template slot="timeIcon">
            Время
            <!-- <v-icon>fas fa-clock</v-icon> -->
          </template>
        </v-datetime-picker>
      </v-col>
      <v-col>
        <v-select
          :items="users"
          label="Пользователь"
          no-data-text="Нет данных"
          item-text="name"
          item-value="name"
          v-model="filterUser"
          multiple>
        </v-select>
      </v-col>
      <v-col>
        <v-select
          :items="actionTypes"
          label="Тип события"
          no-data-text="Не заданы типы событий"
          v-model="filterActionType"
          multiple>
        </v-select>
      </v-col>
      <v-col>
        <v-text-field
          v-model="filterSearch"
          clear-icon="mdi-close-circle"
          clearable
          label="Поиск"
          placeholder="Поиск по дополнительной информации..."
          type="text"
          @click.clear="filterSearch = ''">
        </v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="filteredLogs"
      :items-per-page="5"
      no-data-text="Нет данных"
      class="elevation-1">
  </v-data-table>
  </div>
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
        logs: [],
        filterStart: null,
        filterEnd: null,
        filterUser: [],
        filterActionType: [],
        filterSearch: '',
        users: [
          'keeper1'
        ],
        actionTypes: [
          'Создание нового события',
          'Удаление события'
        ],
        datePickerProps: {
          locale: 'ru-ru'
        },
        timePickerProps: {
          format: '24hr'
        }
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
      },
      filteredLogs() {
        return this.logs.filter(log => {
          return (log.description.toLowerCase().indexOf(this.filterSearch.toLowerCase()) !== -1) &&
            (this.filterUser.length ? (this.filterUser.indexOf(log.user) !== -1) : true) &&
            (this.filterActionType.length ? (this.filterActionType.indexOf(log.actionType) !== -1) : true) &&
            (this.filterStart ? (new Date(log.time) > new Date(this.filterStart)) : true) &&
            (this.filterEnd ? (new Date(log.time) < new Date(this.filterEnd)) : true)
        })
      }
    }
}
</script>