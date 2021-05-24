<template>
    <div>
        <h2>{{ `Камера ${index}` }}</h2>
        <h5>{{ `IP-адрес ${camera.ip}` }}</h5>
        <h5>{{ `Аудитория ${camera.classroom.name}` }}</h5>
        <div :class="`body-2 white--text ${camera.status === 'Неактивна' ? 'red' : 'green'}`" v-text="`Статус: ${camera.status}`"></div>
        <v-divider class="mt-5"></v-divider>
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
    }
}
</script>