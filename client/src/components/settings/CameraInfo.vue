<template>
    <div>
        <h2>{{ `Камера ${index}` }}</h2>
        <h5>{{ `IP-адрес ${camera.ip}` }}</h5>
        <h5>{{ `Аудитория ${camera.classroom.name}` }}</h5>
        <div :class="`body-2 white--text ${cameraStatusColor}`" v-text="`Статус: ${camera.status}`"></div>
        <v-btn class="mt-3" @click="deleteCamera" color="red">Удалить</v-btn>
        <v-divider class="mt-5"></v-divider>
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
export default {
    name: 'CameraInfo',
    props: {
        camera: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        classrooms: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        snackbar: {
            active: false,
            text: ''
        }
    }),
    computed: {
        cameraStatusColor() {
            switch (this.camera.status) {
                case 'Неактивна': return 'red'
                case 'Активна': return 'green'
            }
            return ''
        }
    },
    methods: {
        async deleteCamera() {
            await this.axios.delete(`http://localhost:5000/api/camera/${this.camera._id}`)
                .then(response => {
                    // console.log(response)
                    this.showSnack(response.data.message)
                })
                .catch(error => {
                    console.error(error)
                    this.showSnack(error.message)
                })
        },
        async showSnack(text) {
            this.snackbar.text = text
            this.snackbar.active = true
        }
    }
}
</script>