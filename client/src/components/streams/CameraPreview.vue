<template>
    <v-item v-slot="{ active, toggle }" :value="camera">
        <v-hover v-slot="{ hover }">
            <v-card
                :elevation="hover ? 12 : 2"
                :color="active ? 'primary' : ''"
                class="d-flex align-center"
                dark
                height="200"
                @click="toggle"
                max-width="230"
                max-height="140">
                <v-layout column class="pa-3">
                    <v-layout row justify-center>
                        <video-player
                            ref="videoPlayer"
                            class="vjs-custom-skin"
                            :options="playerOptions"
                            @play="onPlayerPlay($event)"
                            @ready="onPlayerReady($event)">
                        </video-player>
                    </v-layout>
                    <!-- <v-flex xs6>
                        <v-card-title>{{ `Камера ${index}` }}</v-card-title>
                    </v-flex>
                    <v-flex xs6>
                        <v-btn v-if="hover">{{ camera.status === 'Неактивна' ? 'Включить' : 'Выключить' }}</v-btn>
                    </v-flex> -->
                </v-layout>
            </v-card>
        </v-hover>
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
    },
    data: () => ({
        playerOptions: {
            autoplay: true,
            controls: false,
            width: 213,
            height: 120
        }
    }),
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    methods: {
        onPlayerPlay(player) {
            // console.log('Player is PLAYING!', player)
        },
        onPlayerReady(player) {
            // console.log('Player is READY!', player)
        },
        playVideo(source) {
            const video = {
                withCredentials: false,
                type: 'application/x-mpegurl',
                src: source
            }
            this.player.reset()
            this.player.src(video)
            this.player.play()
        }
    },
    mounted() {
        const src = ''
        // this.playVideo(src)
    }
}
</script>