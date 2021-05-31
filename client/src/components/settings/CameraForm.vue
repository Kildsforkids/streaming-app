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
        <v-btn
            color="primary"
            elevation="2">
            Добавить
        </v-btn>
        <v-divider class="mt-5"></v-divider>
    </v-form>
</template>

<script>
import { required, ipAddress } from 'vuelidate/lib/validators'

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
        ip: ''
    }),
    validations: {
        ip: { ipAddress }
    },
    methods: {
        async addCamera() {
            if (this.selectedClassroomId && this.ip) {
                console.log('submitted')
                // await this.axios.post('http://localhost:5000/api/camera', {
                //     ip: this.ip, classroom: this.selectedClassroomId
                // })
                // .then(response => console.log(response.data))
                // .catch(error => console.error(error))
                // this.ip = ''
            }
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