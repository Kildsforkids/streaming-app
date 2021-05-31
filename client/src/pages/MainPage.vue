<template>
    <div>
        <Navbar />
        <v-container>
            <PreviewPanel v-if="getAllCameras.length > 0" :cameras="getAllCameras" :classrooms="getAllClassrooms" :streams="getAllStreams" />
            <div v-else>
                <h2>Нет привязанных камер</h2>
            </div>
            <StreamsTable :cameras="getAllCameras" :streams="getAllStreams" :classrooms="getAllClassrooms" />
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
        this.fetchStreams()
    },
    computed: {
        ...mapGetters([
            'getAllCameras',
            'getAllClassrooms',
            'getAllStreams'
        ])
    },
    methods: {
        ...mapActions([
            'fetchCameras',
            'fetchClassrooms',
            'fetchStreams'
        ])
    }
}
</script>