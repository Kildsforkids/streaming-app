<template>
  <div>
    <v-row>
      <v-col>
        <v-datetime-picker
          label="Начало периода"
          clearText="Сбросить"
          okText="ОК"
          :datePickerProps="filterDatePickerProps"
          :timePickerProps="filterTimePickerProps"
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
          :datePickerProps="filterDatePickerProps"
          :timePickerProps="filterTimePickerProps"
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
          :items="classrooms"
          label="Аудитория"
          no-data-text="Нет доступных аудиторий"
          item-text="name"
          item-value="name"
          v-model="filterClassroom"
          multiple>
        </v-select>
      </v-col>
      <v-col>
        <v-select
          :items="status"
          label="Статус"
          no-data-text="Нет статусов"
          v-model="filterStatus"
          multiple>
        </v-select>
      </v-col>
      <v-col>
        <v-text-field
          v-model="filterSearch"
          clear-icon="mdi-close-circle"
          clearable
          label="Поиск"
          placeholder="Поиск по названию..."
          type="text"
          @click.clear="filterSearch = ''">
        </v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="filteredStreams"
      sort-by="start"
      no-data-text="Нет запланированных событий"
      no-results-text="По Вашему запросу ничего не найдено"
      class="elevation-1"
      >
      <template v-slot:item.start="item">
        <span>{{ getTime(item.value) }}</span>
      </template>
      <template v-slot:item.end="item">
        <span>{{ getTime(item.value) }}</span>
      </template>
      <template v-slot:item.status="item">
        <v-chip small :class="streamStatusColor(item.value)">{{ item.value }}</v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Расписание трансляций</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Добавить
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ editedItem.name }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-datetime-picker
                      label="Дата и время начала"
                      clearText="Сбросить"
                      okText="ОК"
                      :datePickerProps="datePickerProps"
                      :timePickerProps="timePickerProps"
                      v-model="editedItem.start">
                      <template slot="dateIcon">
                        Дата
                      </template>
                      <template slot="timeIcon">
                        Время
                      </template>
                    </v-datetime-picker>
                  </v-row>
                  <v-row>
                    <v-text-field
                      label="Длительность"
                      type="time"
                      v-model="endTime">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <p>{{ getTime(parseNewDateTime(endTime, editedItem.start)) }}</p>
                  </v-row>
                    <v-row>
                      <v-text-field
                        v-model="editedItem.name"
                        label="Название"
                      ></v-text-field>
                    </v-row>
                    <v-row>
                    <v-select
                      :items="cameras"
                      label="Аудитория"
                      no-data-text="Нет доступных аудиторий"
                      item-text="classroom.name"
                      return-object
                      v-model="editedItem.camera">
                    </v-select>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Отмена
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title
                class="headline">Вы уверены,<br>что хотите удалить событие?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Нет</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Да</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
          v-if="item.status !== 'Завершена'"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
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
  </div>
  
</template>

<script>
import {$authHost} from '../../http'
import {createLog} from '../../http/userAPI'

export default {
    name: 'StreamsTable',
    props: {
      classrooms: {
        type: Array,
        required: true
      },
      cameras: {
        type: Array,
        required: true
      },
      streams: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      filterStart: null,
      filterEnd: null,
      filterClassroom: [],
      filterStatus: [],
      filterSearch: '',
      status: [
        'Не задана',
        'Ожидает',
        'Идет',
        'Завершена'
      ],
      filterDatePickerProps: {
        locale: 'ru-ru'
      },
      filterTimePickerProps: {
        format: '24hr'
      },
      datePickerProps: {
        locale: 'ru-ru',
        'allowed-dates': val => new Date(val) > new Date()
      },
      timePickerProps: {
        format: '24hr',
        // 'allowed-hours': val => val > new Date().getHours()
      },
      menuStart: false,
      menuEnd: false,
      headers: [
          { text: 'Дата начала', align: 'start', value: 'start' },
          { text: 'Дата окончания', value: 'end' },
          { text: 'Название', value: 'name' },
          { text: 'Аудитория', value: 'camera.classroom.name' },
          { text: 'Ссылка', value: 'link', sortable: false },
          { text: 'Статус', value: 'status', sortable: false },
          { text: 'Действие', value: 'actions', sortable: false }
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
          _id: '',
          name: 'Новая трансляция',
          start: new Date(),
          end: new Date(),
          link: 'https://www.youtube.com',
          status: 'Не задана',
          camera: {}
      },
      defaultItem: {
          _id: '',
          name: 'Новая трансляция',
          start: new Date(),
          end: new Date(),
          link: 'https://www.youtube.com',
          status: 'Не задана',
          camera: {}
      },
      endTime: '01:30',
      snackbar: {
        active: false,
        text: ''
      }
    }),
    computed: {
      formTitle() {
          return this.editedIndex === -1 ? 'Новая трансляция' : 'Редактировать трансляцию'
      },
      filteredStreams() {
        return this.streams.filter(stream => {
          return (stream.name.toLowerCase().indexOf(this.filterSearch.toLowerCase()) !== -1) &&
            (this.filterClassroom.length ? (this.filterClassroom.indexOf(stream.camera.classroom.name) !== -1) : true) &&
            (this.filterStatus.length ? (this.filterStatus.indexOf(stream.status) !== -1) : true) &&
            (this.filterStart ? (new Date(stream.start) > new Date(this.filterStart)) : true) &&
            (this.filterEnd ? (new Date(stream.start) < new Date(this.filterEnd)) : true)
        })
      }
    },
    watch: {
      endTime(newValue) {
        this.editedItem.end = this.parseNewDateTime(newValue, this.editedItem.start)
      },
      dialog(newValue) {
          newValue || this.close()
      },
      dialogDelete(newValue) {
          newValue || this.closeDelete()
      }
    },
    methods: {
      streamStatusColor(status) {
        switch (status) {
          case 'Не задана': return ''
          case 'Завершена': return 'grey'
          case 'Идет': return 'success'
        }
        return ''
      },
      parseNewDateTime(timeString, startDateTime) {
        const value = timeString.split(':')
        const hours = parseInt(value[0])
        const minutes = parseInt(value[1])
        const newDateTime = this.moment(startDateTime).add(hours, 'H').add(minutes, 'm').toDate()
        return newDateTime
      },
      editItem(item) {
          this.editedIndex = this.streams.indexOf(item)
          item.start = new Date(item.start)
          item.end = new Date(item.end)
          this.editedItem = {...item}
          this.dialog = true
      },
      deleteItem(item) {
          this.editedIndex = this.streams.indexOf(item)
          this.editedItem = {...item}
          this.dialogDelete = true
      },
      async deleteItemConfirm() {
          await $authHost.delete(`api/stream/${this.editedItem._id}`)
            .then(async response => {
              // console.log(response)
              this.showSnack(response.data.message)
              await createLog('Удаление события', `Событие: ${this.editedItem.name} удалено`)
              this.streams.splice(this.editedIndex, 1)
              this.closeDelete()
            })
            .catch(error => {
              console.error(error)
            })
      },
      close() {
          this.dialog = false
      },
      closeDelete() {
          this.dialogDelete = false
          this.$nextTick(() => {
              this.editedItem = {...this.defaultItem}
              this.editedIndex = -1
          })
      },
      async save() {
          await $authHost.post('api/stream', {
            id: this.editedItem._id,
            name: this.editedItem.name,
            start: this.editedItem.start,
            end: this.editedItem.end,
            camera: this.editedItem.camera
          })
          .then(async response => {
            // console.log(response.data)
            this.showSnack(response.data.message)
            await createLog('Добавление события', `Событие: ${this.editedItem.name} добавлено`)
            if (this.editedIndex > -1) {
              // console.log(this.editedItem)
              // Object.assign(this.streams[this.editedIndex], this.editedItem)
              Object.assign(this.streams[this.editedIndex], response.data.stream)
          } else {
              // console.log(this.editedItem)
              // this.streams.push(this.editedItem)
              this.streams.push(response.data.stream)
          }
          })
          .catch(error => console.error(error))
          .finally(() => this.close())
      },
      getTime(time) {
        return this.moment(time).format('DD.MM.YY, HH:mm')
      },
      async showSnack(text) {
        this.snackbar.text = text
        this.snackbar.active = true
      }
    }
}
</script>