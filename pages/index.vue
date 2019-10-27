<template>
  <v-container grid-list-md>
    <v-card class="search-options">
      <v-layout wrap align-center justify-center>
        <v-flex sm4>
          <v-layout wrap align-center justify-center>
            <v-flex sm7>
              <v-text-field
                v-model="courseName"
                label="Name"
                required
              />
            </v-flex>
            <v-flex sm5>
              <v-btn color="info">
                <v-icon left>
                  mdi-magnify
                </v-icon> By Name
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm4>
          <v-layout wrap align-center justify-center>
            <v-flex sm7>
              <v-select
                v-model="department"
                :items="departments"
                label="Department"
                required
              />
            </v-flex>
            <v-flex sm5>
              <v-btn color="blue-grey">
                <v-icon left>
                  mdi-magnify
                </v-icon> By Dept.
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
    <v-layout wrap class="courses">
      <v-flex v-for="(course, index) in courses" :key="index" sm3>
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
              <v-btn @click.stop="deleteCourse(course.id)">
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
    departments: ['CPE', 'CME'],
    course: '',
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
    currentCourse: {}
  }),
  mounted () {
    if (this.$store.state.courses.length > 0) {
      this.courses = this.$store.state.courses
    } else {
      this.fetchCourses()
    }
  },
  methods: {
    async fetchCourses () {
      const courses = await this.$axios.$get(`${this.prefixUrl}/`)
      this.$store.dispatch('updateCourses', courses)
      this.courses = courses
    },
    hideDialog () {
      this.showDialog = false
    },
    showEditDialog (action, course) {
      this.dialogAction = action
      this.showDialog = true
      this.currentCourse = course
    },
    async deleteCourse (id) {
      await this.$axios.delete(`${this.prefixUrl}/${id}/`).then((res) => {
        this.fetchCourses()
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
