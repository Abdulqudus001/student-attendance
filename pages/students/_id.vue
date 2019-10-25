<template>
  <v-container grid-list-md>
    <v-layout wrap align-center>
      <v-flex xs12 sm5>
        <v-card class="student">
          <div class="student__img">
            <img v-if="student.gender=='M'" src="/icons/man.png" alt>
            <img v-else src="/icons/woman.png" alt>
          </div>
          <p class="student__name">
            {{ student.full_name }}
          </p>
          <p><b>Matric No:</b> {{ student.matric_no }}</p>
          <p><b>Email:</b> {{ student.email }}</p>
          <v-chip
            v-for="(course, index) in studentCourses"
            :key="index"
            class="ma-2"
            close
            color="orange"
            label
          >
            {{ course.department }}{{ course.code }}
          </v-chip>
        </v-card>
      </v-flex>
      <v-flex xs12 sm7>
        <v-card>
          <v-card-title>
            Registered Images
          </v-card-title>
          <v-card-text>
            <v-btn fab absolute right bottom @click="showImageDialog = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="showImageDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
        </v-card-title>
        <v-card-text>
          <viewer :images="viewerImages">
            <img class="viewer" v-for="src in viewerImages" :src="src" :key="src">
          </viewer>
          <v-file-input
            :rules="rules"
            v-model="images"
            accept="image/*"
            color="deep-purple accent-4"
            counter
            label="Image"
            multiple
            placeholder="Add image(s)"
            prepend-icon="mdi-camera"
            outlined
            :show-size="1000"
            @change="showImage"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                v-if="index < 2"
                color="deep-purple accent-4"
                dark
                label
                small
              >
                {{ text }}
              </v-chip>

              <span
                v-else-if="index === 2"
                class="overline grey--text text--darken-3 mx-2"
              >
                +{{ images.length - 2 }} File(s)
              </span>
            </template>
          </v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="showImageDialog = false"
          >
            Cancel
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
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    student: {},
    studentCourses: [],
    url: `/students`,
    allCourses: [],
    showImageDialog: false,
    images: [],
    viewerImages: []
  }),
  computed: {
    ...mapState(['courses'])
  },
  mounted () {
    this.fetchStudent()
    this.fetchStudentCourses()
    if (this.$store.state.courses.length > 0) {
      this.allCourses = this.$store.state.courses
    } else {
      this.fetchCourses()
    }
    this.fetchStudentImages()
  },
  methods: {
    async fetchStudent () {
      const id = this.$route.params.id
      const student = await this.$axios.$get(`${this.url}/${id}`)
      this.student = student
    },
    async fetchStudentCourses () {
      const id = this.$route.params.id
      const courses = await this.$axios.$get(`${this.url}/${id}/courses`)
      this.studentCourses = courses
    },
    async fetchCourses () {
      const courses = await this.$axios.$get('/course/')
      this.$store.dispatch('updateCourses', courses)
      this.allCourses = courses
    },
    async fetchStudentImages () {
      const id = this.$route.params.id
      const images = await this.$axios.$get(`${this.url}/${id}/images`)
      this.showImage(images)
    },
    addImage () {
      const id = this.$route.params.id
      this.images.forEach((image) => {
        this.$axios.post(`${this.url}/${id}/images/`, {
          file: image,
          owner: id
        }).then((res) => {
          this.fetchStudentImages()
          this.showImageDialog = false
        })
      })
    },
    showImage (imageArray) {
      console.log(imageArray)
      const images = []
      imageArray.forEach((image) => {
        const reader = new FileReader()
        reader.onload = function (e) {
          images.push(e.target.result)
        }
        reader.readAsDataURL(image)
      })
      this.viewerImages = images
    }
  }
}
</script>

<style lang="scss">
  .student {
    padding: 10px 0;
    text-align: center;
    &__img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: transparent;
      margin: 0 auto;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    &__name {
      margin: 7px 0;
      font-weight: bold;
      font-size: 18px;
    }
  }
  .viewer {
    width: 150px;
    margin: 10px;
  }
</style>
