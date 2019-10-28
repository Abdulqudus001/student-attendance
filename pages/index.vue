<template>
  <v-container grid-list-md>
    <v-card class="search-options">
      <v-layout wrap align-center justify-center>
        <v-flex sm5>
          <v-layout wrap align-center justify-center>
            <v-flex sm7>
              <v-text-field
                v-model="courseName"
                label="Name"
                required
                @keyup.enter="filterByName"
              />
            </v-flex>
            <v-flex sm5>
              <v-btn color="info" @click="filterByName" :disabled="disableNameSearchBtn">
                <v-icon left>
                  mdi-magnify
                </v-icon> By Name
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm2>
          <v-layout wrap align-center justify-center>
            <v-flex sm12>
              <v-select
                v-model="department"
                :items="departments"
                label="Department"
                required
                @change="filterByCourse"
              />
            </v-flex>
            <!-- <v-flex sm5>
              <v-btn color="blue-grey" @click="filterByCourse" :disabled="disableCourseSearchBtn">
                <v-icon left>
                  mdi-magnify
                </v-icon> By Dept.
              </v-btn>
            </v-flex> -->
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
    <v-layout wrap class="courses">
      <v-flex v-for="(course, index) in filteredList" :key="index" sm3>
        <v-card class="course">
          <div class="course__img">
            <img src="/icons/course.png" alt="Book icon">
          </div>
          <p class="course__name">
            {{ course.department }}{{ course.code }}
          </p>
          <v-chip
            pill
            class="ma-2"
            outlined
          >
            <v-avatar
              left
              color="blue-grey"
            >
              {{ course.registered_students.length }}
            </v-avatar>
            Registered Students
          </v-chip>
          <v-layout wrap justify-center>
            <v-flex sm4>
              <v-btn @click.stop="showEditDialog('edit', course)">
                <v-icon color="info">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-flex>
            <v-flex sm4>
              <v-btn @click.stop="showDeleteDialog(course)">
                <v-icon color="error">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          fixed
          bottom
          right
          v-on="on"
          @click="showEditDialog('add')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Add course</span>
    </v-tooltip>
    <v-dialog v-model="deleteDialog" max-width="280">
      <v-card>
        <v-card-title>Are you sure you want to delete this course??</v-card-title>
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
            @click="deleteCourse(selectedCourse.id)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <course-modal
      :show="showDialog"
      :action="dialogAction"
      :course="currentCourse"
      @hideDialog="hideDialog"
      @savedCourse="fetchCourses"
    />
  </v-container>
</template>

<script>
import CourseModal from '@/components/courseModal.vue'
export default {
  components: { CourseModal },
  data: () => ({
    courseName: '',
    department: '',
    departments: ['CPE', 'CME', 'All'],
    course: '',
    selectedCourse: '',
    prefixUrl: '/courses',
    courses: [
      {
        name: 'CPE523',
        department: 'CPE',
        registered_students: 58,
      },
      {
        name: 'CPE524',
        department: 'CPE',
        registered_students: 128,
      },
      {
        name: 'CPE525',
        department: 'CPE',
        registered_students: 88,
      },
      {
        name: 'CPE526',
        department: 'CPE',
        registered_students: 58,
      },
      {
        name: 'CME522',
        department: 'CME',
        registered_students: 128,
      },
      {
        name: 'CME525',
        department: 'CME',
        registered_students: 40,
      },
    ],
    showDialog: false,
    dialogAction: 'edit',
    currentCourse: {},
    deleteDialog: false,
    filteredList: []
  }),
  computed: {
    disableNameSearchBtn () {
      if (this.courseName.length === 0) {
        return true
      } return false
    },
    disableCourseSearchBtn () {
      if (this.department.length === 0) {
        return true
      } return false
    }
  },
  watch: {
    courseName (val) {
      if (val.length === 0) {
        this.filteredList = this.courses
      }
    },
    department (val) {
      if (val === 'All') {
        this.filteredList = this.courses
      }
    }
  },
  mounted () {
    if (this.$store.state.courses.length > 0) {
      this.courses = this.$store.state.courses
      this.filteredList = this.courses
    } else {
      this.fetchCourses()
    }
  },
  methods: {
    filterByName () {
      const filteredList = this.courses.filter((course) => {
        const fullName = `${course.department}${course.code}`
        return fullName.toLowerCase().includes(this.courseName.toLowerCase())
      })
      this.filteredList = filteredList
    },
    filterByCourse () {
      this.filteredList = this.courses
      const filteredList = this.courses.filter((course) => {
        return course.department.includes(this.department)
      })
      this.filteredList = filteredList
    },
    async fetchCourses () {
      const courses = await this.$axios.$get(`${this.prefixUrl}/`)
      this.$store.dispatch('updateCourses', courses)
      this.courses = courses
      this.filteredList = this.courses
    },
    hideDialog () {
      this.showDialog = false
    },
    showEditDialog (action, course) {
      this.dialogAction = action
      this.showDialog = true
      this.currentCourse = course
    },
    showDeleteDialog (course) {
      this.deleteDialog = true
      this.selectedCourse = course
    },
    async deleteCourse (id) {
      await this.$axios.delete(`${this.prefixUrl}/${id}/`).then((res) => {
        this.fetchCourses()
        this.deleteDialog = false
      })
    },
  }
}
</script>

<style lang="scss">
  .search-options {
    padding: 0 20px;
  }
  .courses {
    margin: 20px auto !important;
    .course {
      padding: 10px 0;
      text-align: center;
      &__img {
        width: 60px;
        height: 60px;
        // border-radius: 50%;
        background: transparent;
        margin: 0 auto;
        img {
          width: 100%;
          // border-radius: 50%;
        }
      }
      &__name {
        margin: 7px 0;
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
</style>
