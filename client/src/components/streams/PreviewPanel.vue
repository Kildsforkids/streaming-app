<template>
    <div>
        <CameraDetails @click:outside="hideDetails" :camera="selectedCamera" :currentStream="currentStream" v-if="detailsVisible" />
        <v-item-group v-model="selectedCamera" class="my-5">
            <v-layout row justify-center>
                <v-flex
                    xs12 s6 md4 lg2 mx-5
                    v-for="(camera, index) in cameras"
                    :key="camera.ip">
                    <CameraPreview :camera="camera" :index="index" />
                </v-flex>
            </v-layout>
        </v-item-group>
    </div>
</template>

<script>
import CameraPreview from '@/components/streams/CameraPreview'
import CameraDetails from '@/components/streams/CameraDetails'

export default {
    name: 'PreviewPanel',
    components: {
        CameraPreview,
        CameraDetails
    },
    props: {
        cameras: {
            type: Array,
            required: true
        },
        classrooms: {
            type: Array,
            required: true
        },
        streams: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        detailsVisible: false,
        selectedCamera: {},
        currentStream: {}
    }),
    watch: {
        selectedCamera(newValue) {
            if (newValue) {
                const stream = this.streams.find(stream => (stream.camera._id === newValue._id) && stream.status === 'Идет')
                this.currentStream = stream
                this.showDetails()
            } else {
                this.hideDetails()
            }
        }
    },
    methods: {
        showDetails() {
            this.detailsVisible = true
        },
        hideDetails() {
            this.detailsVisible = false
        }
    }
}
</script>