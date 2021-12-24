<template>
    <v-form @submit.prevent>
        <v-select
          :items="classrooms"
          label="Аудитория"
          no-data-text="Нет доступных аудиторий"
          item-text="name"
          item-value="_id"
          v-model="selectedClassroomId"
        ></v-select>
        <v-text-field
            label="IP-адрес"
            placeholder="IP-адрес"
            outlined
            v-model="ip"
            :error-messages="cameraIPErrors"
            @input="$v.ip.$touch()"
            @blur="$v.ip.$touch()">
        </v-text-field>
        <v-row justify="end">
            <v-btn
                color="primary"
                elevation="2"
                @click="addCamera">
                Добавить
            </v-btn>
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
        <v-divider class="mt-5"></v-divider>
    </v-form>
</template>

<script>
import { required, ipAddress } from 'vuelidate/lib/validators'
import {$authHost} from '../../http'
import {createLog} from '../../http/userAPI'

export default {
    name: 'CameraForm',
    props: {
        classrooms: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        selectedClassroomId: '',
        ip: '',
        snackbar: {
            active: false,
            text: ''
        }
    }),
    validations: {
        ip: { ipAddress }
    },
    methods: {
        async addCamera() {
            console.log('hay')
            if (this.selectedClassroomId && this.ip) {
                await $authHost.post('api/camera', {
                    ip: this.ip, classroom: this.selectedClassroomId
                })
                .then(async response => {
                    console.log(response.data)
                    this.showSnack(response.data.message)
                    this.$store.commit('addCamera', response.data.camera)
                    await createLog('Добавление объекта', `Камера ${this.ip} добавлена`)
                    this.ip = ''
                })
                .catch(error => console.error(error))
            }
        },
        async showSnack(text) {
            this.snackbar.text = text
            this.snackbar.active = true
        }
    },
    computed: {
        cameraIPErrors() {
            const errors = []
            if (!this.$v.ip.$dirty) return errors
            // !this.$v.classroomName.required && errors.push('Вы не заполнили поле')
            // !this.$v.classroomName.decimal && errors.push('Имя должно содержать только цифры')
            // !this.$v.classroomName.minLength && errors.push('Имя должно быть 4 символа')
            // !this.$v.classroomName.maxLength && errors.push('Имя должно быть 4 символа')
            !this.$v.ip.ipAddress && errors.push('IP-адрес должен быть формата 0.0.0.0')
            return errors
        }
    }
}
</script>