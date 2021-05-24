<template>
    <v-item v-slot="{ active, toggle }" :value="camera">
        <v-card
            :color="active ? 'primary' : ''"
            class="d-flex align-center"
            dark
            height="200"
            @click="toggle"
            >
            <v-card-title>{{ `Камера ${index}` }}</v-card-title>
        </v-card>
    </v-item>
</template>

<script>
export default {
    name: 'CameraPreview',
    props: {
        camera: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    }
}
</script>

<style>

</style>