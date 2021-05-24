<template>
    <div>
        <v-text-field
            label="Аудитоиря"
            placeholder="Аудитория"
            v-model="classroomName"
            outlined>
        </v-text-field>
        <v-btn
            color="primary"
            elevation="2"
            @click="addClassroom">
            Добавить
        </v-btn>
        <v-divider class="mt-5"></v-divider>
    </div>
</template>

<script>
export default {
    name: 'ClassroomForm',
    data: () => ({
        classroomName: ''
    }),
    methods: {
        async addClassroom() {
            if (this.classroomName) {
                await this.axios.post('http://localhost:5000/api/classroom', {
                    name: this.classroomName
                })
                .then(response => console.log(response.data))
                .catch(error => console.error(error))
                this.classroomName = ''
            }
        }
    }
}
</script>