<template>
  <v-container grid-list-md>
    <custom-loader v-show="showLoader" />
    <capture-image
      v-show="captureImage"
      :show="captureImage"
      @closeDialog="closeDialog"
      @showLoader="handleLoaderDisplay"
      @imageSent="updatePage"
    />
    <v-layout wrap align-center>
      <v-flex xs12 sm5>
        <v-card class="student">
          <div class="student__img">
            <img v-if="viewerImages[0]" :src="viewerImages[0].url" :alt="student.full_name">
            <img v-else-if="student.gender === 'M'" src="/icons/man.png" :alt="student.full_name">
            <img
              v-else-if="student.gender === 'F'"
              src="/icons/woman.png"
              :alt="student.full_name"
            >
          </div>
          <p class="student__name">
            {{ student.full_name | capitalize }}
          </p>
          <p><b>Matric No:</b> {{ student.matric_no }}</p>
          <p><b>Email:</b> {{ student.email }}</p>
          <v-chip
            v-for="(course, index) in studentCourses"
            :key="index"
            class="ma-2"
            color="info"
            label
          >
            {{ course.department }}{{ course.code }}
          </v-chip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn fab small v-on="on" @click="showAddCourseDialog = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Add Course</span>
          </v-tooltip>
        </v-card>
      </v-flex>
      <v-flex xs12 sm7>
        <v-card max-height="470px" height="470px" class="student-images">
          <v-card-title>
            Registered Images
          </v-card-title>
          <v-card-text>
            <viewer :images="viewerImages">
              <v-layout wrap>
                <v-flex v-for="src in viewerImages" :key="src.id">
                  <v-card
                    height="200px"
                    class="viewer-card"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  >
                    <img class="viewer" :src="src.url">
                    <v-card-actions>
                      <v-spacer />
                      <v-btn icon @click="showDeleteDialog(src)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </viewer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  fab
                  fixed
                  right
                  bottom
                  v-on="on"
                  @click="showImageDialog = true; showAlert = false"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Image</span>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Dialog to add image -->
    <v-dialog
      v-model="showImageDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-alert v-model="showAlert" color="error">
          <v-layout align-center>
            {{ alertMessage }}
            <v-spacer />
            <v-btn icon @click="showAlert = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-layout>
        </v-alert>
        <v-card-title class="headline" />
        <v-card-text>
          <viewer :images="seletedImages">
            <img v-for="src in seletedImages" :key="src" :src="src" class="viewer">
          </viewer>
          <v-file-input
            v-model="images"
            accept="image/*;capture=camera"
            counter
            label="Image"
            multiple
            placeholder="Add image(s)"
            prepend-icon="mdi-camera"
            outlined
            :color="imageSize > 200000 ? 'red' : 'deep-purple accent-4'"
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
          <p v-show="imageSize > 200000" class="error-txt">
            Image size exceeds 200KB
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="captureImage = true"
          >
            Start Capture
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            @click="showImageDialog = false; showAlert = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="blue-grey"
            :disabled="isFormInvalid"
            @click="addImage"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog to add courses to students -->
    <v-dialog v-model="showAddCourseDialog" max-width="360px">
      <v-card>
        <v-card-title>Add Course</v-card-title>
        <v-card-text>
          <v-combobox
            v-model="selectedCourses"
            :items="getCourseNames"
            chips
            label="Select courses"
            multiple
            solo
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                @click="select"
                @click:close="remove(item)"
              >
                <strong>{{ item }}</strong>&nbsp;
              </v-chip>
            </template>
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="showAddCourseDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="blue-grey"
            :disabled="selectedCourses.length <= 0"
            @click="addCourseToStudent"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog to confirm image removal -->
    <v-dialog v-model="deleteDialog" max-width="280">
      <v-card>
        <v-card-title>Are you sure you want to delete this image??</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-grey"
            text
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            text
            @click="deleteImage(selectedImage.id)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CaptureImage from '@/components/captureImage'
import CustomLoader from '~/components/loader.vue'
export default {
  components: { CaptureImage, CustomLoader },
  data: () => ({
    student: {},
    studentCourses: [],
    url: `/students`,
    allCourses: [],
    showImageDialog: false,
    images: [],
    viewerImages: [],
    seletedImages: [],
    imagesToBeUploaded: [],
    showAddCourseDialog: false,
    selectedCourses: [],
    showAlert: false,
    alertMessage: '',
    captureImage: false,
    selectedImage: '',
    deleteDialog: false,
    imageSize: 0,
    showLoader: false
  }),
  computed: {
    ...mapState(['courses']),
    ...mapGetters(['getCourseNames']),
    isFormInvalid () {
      if (this.imagesToBeUploaded.length > 0 && this.imageSize < 200000) {
        return false
      } else {
        return true
      }
    }
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
    updatePage () {
      this.fetchStudent()
      this.fetchStudentCourses()
      this.fetchCourses()
      this.fetchStudentImages()
    },
    handleLoaderDisplay (e) {
      this.showLoader = e
    },
    closeDialog () {
      // Close dialog for image capture
      this.captureImage = false
      this.showImageDialog = false
      this.showAlert = false
      this.fetchStudentImages()
    },
    fetchStudent () {
      this.showLoader = true
      const id = this.$route.params.id
      this.$axios.$get(`${this.url}/${id}`).then((students) => {
        this.student = students
        this.showLoader = false
      })
    },
    fetchStudentCourses () {
      this.showLoader = true
      const id = this.$route.params.id
      this.$axios.$get(`${this.url}/${id}/courses`).then((courses) => {
        this.studentCourses = courses
        this.selectedCourses = this.extractCourseNames(courses)
        this.showLoader = false
      })
    },
    fetchCourses () {
      this.showLoader = true
      this.$axios.$get('/courses/').then((courses) => {
        this.$store.dispatch('updateCourses', courses)
        this.allCourses = courses.data
        this.showLoader = false
      })
    },
    fetchStudentImages () {
      this.showLoader = true
      const id = this.$route.params.id
      this.$axios.$get(`${this.url}/${id}/images`).then((images) => {
        this.showStudentImages(images)
        this.showLoader = false
      })
    },
    addImage () {
      const id = this.$route.params.id
      // Loop through added images
      this.imagesToBeUploaded.forEach((image) => {
        this.showLoader = true
        // Create new formData to handle image upload
        const form = new FormData()
        form.append('file', image, image.name)
        form.append('owner', id)
        this.$axios.post(`/images/`, form, { headers: {
          'content-type': 'multipart/form-data'
        } }).then((res) => {
          this.showLoader = false
          // Fetch students list after update
          this.fetchStudentImages()
          this.showImageDialog = false
          this.showAlert = false
        }).catch((err) => {
          this.showAlert = true
          this.alertMessage = err.response.data[Object.keys(err.response.data)[0]]
        })
      })
    },
    showDeleteDialog (image) {
      this.deleteDialog = true
      this.selectedImage = image
    },
    deleteImage (id) {
      this.$axios.delete(`/images/${id}`).then((res) => {
        this.deleteDialog = false
        this.fetchStudentImages()
      })
    },
    showImage (imageArray) {
      const imageSize = imageArray.reduce((acc, image) => {
        return acc + image.size
      }, 0)
      this.imageSize = imageSize
      const images = []
      imageArray.forEach((image) => {
        const reader = new FileReader()
        reader.onload = function (e) {
          images.push(e.target.result)
        }
        reader.readAsDataURL(image)
      })
      this.imagesToBeUploaded = imageArray
      this.seletedImages = images
    },
    showStudentImages (imageArray) {
      let images = []
      if (typeof (imageArray) === 'object') {
        images = imageArray.map((image) => {
          return {
            id: image.id,
            url: `${process.env.BASE_URL}${image.file}`,
          }
        })
        this.viewerImages = images
      }
    },
    remove (item) {
      this.selectedCourses.splice(this.selectedCourses.indexOf(item), 1)
      this.selectedCourses = [...this.selectedCourses]
    },
    addCourseToStudent () {
      const selectedCourses = this.allCourses.filter((course) => {
        return this.selectedCourses.includes(`${course.department}${course.code}`)
      })
      selectedCourses.forEach(this.addCourse)
    },
    addCourse (course) {
      this.showLoader = true
      this.$axios.put(`/courses/${course.id}/`, {
        department: course.department,
        name: course.name,
        code: course.code,
        description: course.description,
        registered_students: [...course.registered_students, this.$route.params.id]
      }).then((res) => {
        this.fetchStudentCourses()
        this.showAddCourseDialog = false
        this.fetchCourses()
      }).catch((err) => {
        console.log(err)
      })
    },
    extractCourseNames (courses) {
      return courses.map((course) => {
        return `${course.department}${course.code}`
      })
    }
  }
}
</script>

<style lang="scss">
  .student-images {
    overflow-y: auto;
  }
  .student {
    padding: 10px 0;
    text-align: center;
    &__img {
      width: 70px;
      height: 70px;
      // border-radius: 50%;
      background: transparent;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        // border-radius: 50%;
      }
    }
    &__name {
      margin: 7px 0;
      font-weight: bold;
      font-size: 18px;
    }
  }
  .viewer-card {
    text-align: center;
  }
  .viewer {
    // width: 150px;
    height: 120px;
    margin: 10px auto;
  }
  .error-txt {
    font-size: 0.8rem;
    color: #ee1717;
    margin: -20px 0 0 30px;
  }
</style>
