<template>
    <v-form @submit.prevent="addClassroom">
        <v-text-field
            label="Аудитория"
            placeholder="Аудитория"
            v-model.trim="classroomName"
            outlined
            :error-messages="classroomNameErrors"
            @input="$v.classroomName.$touch()"
            @blur="$v.classroomName.$touch()">
        </v-text-field>
        <!-- <v-icon
            small
            color="red"
            class="float-right">
            mdi-delete
        </v-icon> -->
        <!-- <v-list shaped>
            <v-list-item-group
                v-model="selectedClassrooms"
                multiple>
                <template
                    v-for="classroom in classrooms">
                    <v-list-item
                        :key="classroom.name"
                        :value="classroom"
                        active-class="blue">
                        <template v-slot:default="{ active }">
                            <v-list-item-content>
                                <v-list-item-title v-text="classroom.name"></v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-checkbox
                                    :input-value="active"
                                    color="blue">
                                </v-checkbox>
                            </v-list-item-action>
                        </template>
                    </v-list-item>
                </template>
            </v-list-item-group>
        </v-list> -->
        <v-row justify="end">
            <v-btn
                color="primary"
                elevation="2"
                @click="addClassroom">
                Добавить
            </v-btn>
        </v-row>
        <v-autocomplete
            placeholder="Здесь можно выбрать аудитории для удаления"
            v-model="selectedClassrooms"
            :items="classrooms"
            item-text="name"
            return-object
            chips
            hide-details
            hide-no-data
            hide-selected
            multiple
            single-line>
        </v-autocomplete>
        <!-- <p :key="classroom.name" v-for="classroom in selectedClassrooms">{{ classroom.name }}</p> -->
        <v-row class="mt-5" justify="end">
            <v-btn
                color="red"
                elevation="2"
                dark
                @click="deleteClassrooms">
                Удалить
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
import { required, decimal, minLength, maxLength } from 'vuelidate/lib/validators'
import {$authHost} from '../../http'
import {createLog} from '../../http/userAPI'

export default {
    name: 'ClassroomForm',
    props: {
        classrooms: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        classroomName: '',
        selectedClassrooms: [],
        snackbar: {
            active: false,
            text: ''
        }
    }),
    validations: {
        classroomName: {decimal, minLength: minLength(4), maxLength: maxLength(4)}
    },
    methods: {
        async addClassroom() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }
            if (this.classroomName) {
                await $authHost.post('api/classroom', {
                    name: this.classroomName
                })
                .then(async response => {
                    // console.log(response.data)
                    this.showSnack(response.data.message)
                    this.classrooms.push(response.data.classroom)
                    await createLog('Добавление объекта', `Аудитория ${this.classroomName} добавлена`)
                    this.classroomName = ''
                })
                .catch(error => {
                    console.error(error.message)
                    this.showSnack(`Произошла ошибка: ${error.message}`)
                })
            }
        },
        async deleteClassrooms() {
            await this.selectedClassrooms.map(async (classroom) => {
                await $authHost.delete(`api/classroom/${classroom._id}`)
                    .then(async response => {
                        // console.log(response.data)
                        this.showSnack(response.data.message)
                        await createLog('Удаление объекта', `Аудитория ${classroom.name} удалена`)
                        const index = this.classrooms.indexOf(classroom)
                        if (index !== -1)
                            this.classrooms.splice(index, 1)
                    })
                    .catch(error => {
                        console.error(error.message)
                        this.showSnack(`Произошла ошибка: ${error.message}`)
                    })
            })
        },
        async showSnack(text) {
            this.snackbar.text = text
            this.snackbar.active = true
        }
    },
    computed: {
        classroomNameErrors() {
            const errors = []
            if (!this.$v.classroomName.$dirty) return errors
            // !this.$v.classroomName.required && errors.push('Вы не заполнили поле')
            !this.$v.classroomName.decimal && errors.push('Имя должно содержать только цифры')
            !this.$v.classroomName.minLength && errors.push('Имя должно быть 4 символа')
            !this.$v.classroomName.maxLength && errors.push('Имя должно быть 4 символа')
            return errors
        }
    }
}
</script>