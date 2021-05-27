<template>
  <v-row>
      <v-tabs v-model="tab">
        <v-tab href="#tab-1">Превью</v-tab>
        <v-tab v-if="currentStream.link" href="#tab-2">Трансляция</v-tab>
     </v-tabs>
      <v-col cols="8">
        <v-tabs-items v-model="tab">
            <v-tab-item
                value="tab-1">
                <v-card
                    elevation="2">
                    <v-img
                        height="400"
                        src="https://picsum.photos/id/11/500/300"></v-img>
                </v-card>
            </v-tab-item>
            <v-tab-item
                value="tab-2">
                <v-card
                    elevation="2">
                    <iframe
                        height="400"
                        width="600"
                        src="https://www.youtube.com/embed/ZBb6Ca1084k"
                        frameborder="0"></iframe>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="4">
          <div>
              <h3>{{ `Камера ${camera.classroom.name}` }}</h3>
              <h5>{{ `IP-адрес: ${camera.ip}` }}</h5>
              <div :class="`body-2 white--text ${cameraStatusColor}`" v-text="`Статус: ${camera.status}`"></div>
          </div>
      </v-col>
  </v-row>
</template>

<script>
export default {
    name: 'CameraDetails',
    props: {
        camera: {
            type: Object,
            required: true
        },
        currentStream: {
            type: Object
        }
    },
    data: () => ({
        tab: null
    }),
    computed: {
        cameraStatusColor() {
            switch (this.camera.status) {
                case 'Неактивна': return 'red'
                case 'Активна': return 'green'
            }
            return ''
        }
    }
}
</script>