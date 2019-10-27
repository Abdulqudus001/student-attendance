<template>
  <v-container grid-list-md>
    <student-modal
      :show="showDialog"
      :action="dialogAction"
      :student="currentStudent"
      @hideDialog="hideDialog"
      @savedStudent="fetchStudents"
    />
    <v-card class="search-options">
      <v-layout wrap align-center justify-center>
        <v-flex sm4>
          <v-layout wrap align-center justify-center>
            <v-flex sm8>
              <v-text-field v-model="studentId" label="ID" required />
            </v-flex>
            <v-flex sm4>
              <v-btn color="blue-grey" @click="filterById">
                <v-icon left>
                  mdi-magnify
                </v-icon>By ID
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm4>
          <v-layout wrap align-center justify-center>
            <v-flex sm7>
              <v-text-field v-model="studentName" label="Name" required />
            </v-flex>
            <v-flex sm5>
              <v-btn color="info" @click="filterByName">
                <v-icon left>
                  mdi-magnify
                </v-icon>By Name
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm4>
          <v-layout wrap align-center justify-center>
            <v-flex sm7>
              <v-select v-model="course" :items="getCourseNames" label="Courses" required />
            </v-flex>
            <v-flex sm5>
              <v-btn color="error" @click="filterByCourse">
                <v-icon left>
                  mdi-magnify
                </v-icon>By course
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
    <v-layout wrap class="students">
      <v-flex v-for="(student, index) in filteredList" :key="index" sm3>
        <v-card class="student">
          <div class="student__img">
            <img v-if="student.image" :src="student.image" :alt="student.full_name">
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
          <v-layout wrap justify-center>
            <v-flex sm4>
              <v-btn @click.stop="showEditDialog('edit', student)">
                <v-icon color="info">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-flex>
            <v-flex sm4>
              <v-btn @click.stop="deleteStudent(student.id)">
                <v-icon color="error">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-flex>
            <v-flex sm4>
              <v-btn @click="showStudent(student.id)">
                <v-icon color="blue-grey">
                  mdi-check
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
      <span>Add student</span>
    </v-tooltip>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import StudentModal from '@/components/studentModal.vue'
export default {
  components: { StudentModal },
  data: () => ({
    studentId: '',
    studentName: '',
    course: '',
    students: [
      {
        full_name: 'Abdul',
        gender: 'M',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Deven',
        gender: 'F',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Emjaay',
        gender: 'F',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Gami',
        gender: 'M',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Ismo',
        gender: 'F',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Mensaah',
        gender: 'M',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Deven',
        gender: 'F',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Emjaay',
        gender: 'F',
        matric_no: '2014/1/52228cp'
      },
      {
        full_name: 'Gami',
        gender: 'M',
        matric_no: '2014/1/52228cp'
      }
    ],
    showDialog: false,
    dialogAction: 'edit',
    currentStudent: {},
    filteredList: []
  }),
  computed: {
    ...mapGetters(['getCourseNames'])
  },
  watch: {
    studentName (val) {
      if (val.length === 0) {
        this.filteredList = this.students
      }
    },
    studentId (val) {
      if (val.length === 0) {
        this.filteredList = this.students
      }
    },
    course (val) {
      if (val === 'Reset') {
        this.filteredList = this.students
      }
    }
  },
  mounted () {
    if (this.$store.state.students.length > 0) {
      this.students = this.$store.state.students
      this.filteredList = this.students
      this.fetchStudentCourses()
      this.fetchStudentImages()
      this.$store.dispatch('updateStudent', this.students)
    } else {
      this.fetchStudents()
    }
    // Check if course exist in store else query backend
    if (this.$store.state.courses.length <= 0) {
      this.fetchCourses()
    }
  },
  methods: {
    filterByName () {
      const filteredList = this.students.filter((student) => {
        return student.full_name.toLowerCase().includes(this.studentName.toLowerCase())
      })
      this.filteredList = filteredList
    },
    filterById () {
      const filteredList = this.students.filter((student) => {
        return student.matric_no.toLowerCase().includes(this.studentId.toLowerCase())
      })
      this.filteredList = filteredList
    },
    filterByCourse () {
      const filteredList = this.students.filter((student) => {
        return student.courses.includes(this.course)
      })
      this.filteredList = filteredList
    },
    async fetchCourses () {
      const courses = await this.$axios.$get(`course/`)
      this.$store.dispatch('updateCourses', courses)
    },
    async fetchStudents () {
      const students = await this.$axios.$get('/students/')
      // Dispatch students without courses list to store
      this.$store.dispatch('updateStudent', students)
      this.students = students
      this.filteredList = this.students
      // Get students with courses list and dispatch to store
      this.fetchStudentCourses()
      this.$store.dispatch('updateStudent', this.students)
      // Get student with profile photo and dispatch to store
      this.fetchStudentImages()
      this.$store.dispatch('updateStudent', this.students)
      this.filteredList = this.students
    },
    async fetchStudentCourses () {
      // Get individual student courses
      const updatedStudent = []
      await this.students.forEach((student) => {
        this.$axios.$get(`/students/${student.id}/courses`).then((res) => {
          const courses = res.map((course) => {
            return `${course.department}${course.code}`
          })
          const newObj = { ...student, courses: [...courses] }
          updatedStudent.push(newObj)
          this.students = updatedStudent
          this.filteredList = this.students
        })
      })
    },
    async fetchStudentImages () {
      const updatedStudent = []
      await this.students.forEach((student) => {
        this.$axios.$get(`/students/${student.id}/images`).then((res) => {
          const images = res.map((image) => {
            return `http://localhost:8000${image.file}`
          })
          const newObj = { ...student, image: images[0] }
          updatedStudent.push(newObj)
          this.students = updatedStudent
          this.filteredList = this.students
        })
      })
    },
    async deleteStudent (id) {
      await this.$axios.delete(`/students/${id}/`).then((res) => {
        this.fetchStudents()
      })
    },
    showEditDialog (action, student) {
      this.dialogAction = action
      this.showDialog = true
      this.currentStudent = student
    },
    hideDialog () {
      this.showDialog = false
    },
    showStudent (id) {
      this.$router.push(`/students/${id}`)
    }
    // async x () {
    //   await this.$axios.post('/students/1/courses/', {
    //     course: 1
    //   }).then((res) => {
    //     console.log(res)
    //   })
    // }
  }
}
</script>

<style lang="scss">
.search-options {
  padding: 0 20px;
}
.students {
  margin: 20px auto !important;
  .student {
    padding: 10px 0;
    text-align: center;
    &__img {
      width: 60px;
      height: 60px;
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
}
</style>
