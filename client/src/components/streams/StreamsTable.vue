<template>
  <v-data-table
    :headers="headers"
    :items="streams"
    sort-by="start"
    class="elevation-1"
  >
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
                    <v-menu
                      v-model="menuStart"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.start"
                          label="Дата начала"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.start"
                        @input="menuStart = false"
                        :first-day-of-week="1"
                        locale="ru-ru">
                      </v-date-picker>
                    </v-menu>
                </v-row>
                <v-row>
                    <v-menu
                      v-model="menuEnd"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.end"
                          label="Дата окончания"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.end"
                        @input="menuEnd = false"
                        :first-day-of-week="1"
                        locale="ru-ru">
                      </v-date-picker>
                    </v-menu>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.name"
                      label="Название"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.link"
                      label="Ссылка"
                      disabled
                    ></v-text-field>
                  </v-row>
                  <v-row>
                  <v-select
                    :items="cameras"
                    label="Аудитория"
                    no-data-text="Нет доступных аудиторий"
                    item-text="classroom.name"
                    item-value="_id"
                    v-model="editedItem.cameraId">
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
            <v-card-title class="headline">Вы уверены, что хотите удалить данное событие?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">ОК</v-btn>
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
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Сбросить
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
    name: 'StreamsTable',
    props: {
      // classrooms: {
      //   type: Array,
      //   required: true
      // },
      cameras: {
        type: Array,
        required: true
      }
    },
    data: () => ({
        streams: [],
        // start: new Date().toISOString().substr(0, 10),
        menuStart: false,
        menuEnd: false,
        headers: [
            {
                text: 'Дата начала',
                align: 'start',
                sortable: true,
                value: 'start',
            },
            {
                text: 'Дата окончания',
                sortable: true,
                value: 'end',
            },
            { text: 'Название', value: 'name' },
            { text: 'Ссылка', value: 'link' },
            { text: 'Статус', value: 'status' },
            { text: 'Действие', value: 'actions', sortable: false }
        ],
        dialog: false,
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
            name: 'Новая трансляция',
            start: new Date().toISOString().substr(0, 10),
            end: new Date().toISOString().substr(0, 10),
            link: 'https://www.youtube.com',
            status: 'Не задана',
            cameraId: ''
        },
        defaultItem: {
            name: 'Новая трансляция',
            start: new Date().toISOString().substr(0, 10),
            end: new Date().toISOString().substr(0, 10),
            link: 'https://www.youtube.com',
            status: 'Не задана',
            cameraId: ''
        }
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Новая трансляция' : 'Редактировать трансляцию'
        }
    },
    watch: {
        dialog(newValue) {
            newValue || this.close()
        },
        dialogDelete(newValue) {
            newValue || this.closeDelete()
        }
    },
    created() {
        this.initialize()
    },
    methods: {
        async initialize() {
            await this.axios.get('http://localhost:5000/api/stream')
                .then(response => {
                  // console.log(response)
                  this.streams = response.data.map(data => ({...data, status: 'Ожидает'}))
                })
                .catch(error => console.error(error))
        },
        editItem(item) {
            this.editedIndex = this.streams.indexOf(item)
            this.editedItem = {...item}
            this.dialog = true
        },
        deleteItem(item) {
            this.editedIndex = this.streams.indexOf(item)
            this.editedItem = {...item}
            this.dialogDelete = true
        },
        deleteItemConfirm() {
            this.streams.splice(this.editedIndex, 1)
            this.closeDelete()
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
            await this.axios.post('http://localhost:5000/api/stream', {
              name: this.editedItem.name,
              start: this.editedItem.start,
              end: this.editedItem.end, 
              camera: this.editedItem.camera
            })
            .then(response => {
              console.log(response.data)
              if (this.editedIndex > -1) {
                // console.log(this.editedItem)
                Object.assign(this.streams[this.editedIndex], this.editedItem)
            } else {
                // console.log(this.editedItem)
                this.streams.push(this.editedItem)
            }
            })
            .catch(error => console.error(error))
            .finally(() => this.close())
        },
        getTime(time) {
          return this.moment(time).format('DD.MM.YY, HH:mm')
        }
    }
}
</script>