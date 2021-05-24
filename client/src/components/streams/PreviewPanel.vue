<template>
    <div>
        <CameraDetails @click:outside="hideDetails" :camera="selectedCamera" v-if="detailsVisible" />
        <v-item-group v-model="selectedCamera">
            <v-container>
                <v-row>
                    <v-col
                        v-for="(camera, index) in cameras"
                        :key="camera.ip"
                        cols="12"
                        md="4"
                        >
                        <CameraPreview :camera="camera" :index="index" />
                    </v-col>
                </v-row>
            </v-container>
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
        }
    },
    data: () => ({
        detailsVisible: false,
        selectedCamera: {},
    }),
    watch: {
        selectedCamera(newValue) {
            if (newValue) {
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