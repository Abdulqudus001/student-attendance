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
        <v-card>Hey</v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    student: {},
    studentCourses: [],
    url: `/students`,
    allCourses: []
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
</style>
