<template>
    <div>
        <Navbar />
        <v-container>
            <v-row class="d-flex justify-center">
                <v-col cols="4">
                    <h2 class="mt-2">Добавление аудиторий</h2>
                    <ClassroomForm class="mt-2" :classrooms="getAllClassrooms" />
                    <h2 class="mt-2">Добавление камер</h2>
                    <CameraForm class="mt-2" :classrooms="getAllClassrooms" />
                    <h2 class="mt-2">Информация по камерам</h2>
                    <CameraInfo class="mt-2" v-for="(camera, index) in getAllCameras" :camera="camera" :index="index" :classrooms="getAllClassrooms" :key="camera.ip"/>
                    <h2 v-if="getAllCameras.length <= 0">Пока еще нет добавленных камер</h2>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import ClassroomForm from '@/components/settings/ClassroomForm'
import CameraForm from '@/components/settings/CameraForm'
import CameraInfo from '@/components/settings/CameraInfo'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'SettingsPage',
    components: {
        Navbar,
        ClassroomForm,
        CameraForm,
        CameraInfo
    },
    mounted() {
        this.fetchClassrooms()
        this.fetchCameras()
    },
    methods: {
        ...mapActions([
            'fetchClassrooms',
            'fetchCameras'
        ])
    },
    computed: {
        ...mapGetters([
            'getAllCameras',
            'getAllClassrooms'
        ])
    }
}
</script>