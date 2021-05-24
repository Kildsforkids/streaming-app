<template>
    <div>
        <Navbar />
        <v-container>
            <PreviewPanel v-if="getAllCameras.length > 0" :cameras="getAllCameras" :classrooms="getAllClassrooms" />
            <div v-else>
                <h2>Нет привязанных камер</h2>
            </div>
            <StreamsTable :cameras="getAllCameras" />
        </v-container>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import PreviewPanel from '@/components/streams/PreviewPanel'
import StreamsTable from '@/components/streams/StreamsTable'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'MainPage',
    components: {
        Navbar,
        PreviewPanel,
        StreamsTable
    },
    created() {
        this.fetchCameras()
        this.fetchClassrooms()
    },
    computed: {
        ...mapGetters([
            'getAllCameras',
            'getAllClassrooms'
        ])
    },
    methods: {
        ...mapActions([
            'fetchCameras',
            'fetchClassrooms'
        ])
    }
}
</script>