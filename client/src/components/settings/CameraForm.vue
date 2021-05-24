<template>
    <div>
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
            v-model="ip">
        </v-text-field>
        <v-btn
            color="primary"
            elevation="2"
            @click="addCamera">
            Добавить
        </v-btn>
        <v-divider class="mt-5"></v-divider>
    </div>
</template>

<script>
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
    methods: {
        async addCamera() {
            if (this.selectedClassroomId && this.ip) {
                await this.axios.post('http://localhost:5000/api/camera', {
                    ip: this.ip, classroom: this.selectedClassroomId
                })
                .then(response => console.log(response.data))
                .catch(error => console.error(error))
                this.ip = ''
            }
        }
    }
}
</script>