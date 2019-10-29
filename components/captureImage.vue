<template>
  <v-dialog v-model="show" max-width="560">
    <v-card>
      <v-alert v-model="showAlert" color="error">
        {{ alertMessage }}
      </v-alert>
      <v-card-text>
        <v-layout justify-center>
          <img ref="stream" class="stream" crossorigin="Anonymous" src="http://192.168.122.1:8000/video" alt="">
        </v-layout>
        <v-layout wrap>
          <v-flex>
            <canvas id="canvas" ref="canvas" />
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex v-for="(image, index) in captures" :key="index">
            <v-card>
              <img :src="image" alt="" class="captured">
              <v-card-actions>
                <v-spacer />
                <v-btn icon @click="deleteImage(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          @click="$emit('closeDialog')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue-grey"
          @click="capture"
        >
          Capture
        </v-btn>
        <v-btn
          color="blue-grey"
          @click="addImage"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    video: [],
    canvas: [],
    captures: [],
    showAlert: false,
    alertMessage: ''
  }),
  methods: {
    capture () {
      const video = this.$refs.stream
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, 150, 150)
      const img = new Image()
      img.src = canvas.toDataURL()
      this.captures.push(img.src)
    },
    deleteImage (index) {
      this.captures.splice(index, 1)
    },
    addImage () {
      const id = this.$route.params.id
      // Loop through added images
      this.captures.forEach((image) => {
        // Create new formData to handle image upload
        const form = new FormData()
        fetch(image).then(res => res.blob()).then((blob) => {
          // Create a new file from base64 image
          const file = new File([blob], 'image.jpeg')
          form.append('file', file, file.name)
          form.append('owner', id)
          this.$axios.post(`/images/`, form, { headers: {
            'content-type': 'multipart/form-data'
          } }).then((res) => {
            this.$emit('closeDialog')
          }).catch((err) => {
            this.showAlert = true
            this.alertMessage = err.response.data[Object.keys(err.response.data)[0]]
          })
        })
      })
    },
  }
}
</script>

<style lang="scss">
.stream {
  margin: 10px auto;
  // width: 300px;
  // height: 300px;
}
#canvas {
  display: none;
}
.captured {
  margin: 10px;
}
</style>
