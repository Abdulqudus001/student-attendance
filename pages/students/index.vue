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
              <v-btn color="blue-grey">
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
              <v-select v-model="course" :items="courses" label="Courses" required />
            </v-flex>
            <v-flex sm5>
              <v-btn color="error">
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
      <v-flex v-for="(student, index) in students" :key="index" sm3>
        <v-card class="student">
          <div class="student__img">
            <img v-if="student.gender=='M'" src="/icons/man.png" alt>
            <img v-else src="/icons/woman.png" alt>
          </div>
          <p class="student__name">
            {{ student.full_name }}
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
import StudentModal from '@/components/studentModal.vue'
export default {
  components: { StudentModal },
  data: () => ({
    studentId: '',
    studentName: '',
    courses: ['CPE523', 'CPE524', 'CPE525', 'CPE525', 'EEE522'],
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
    filterBy: null,
    param: null,
    showDialog: false,
    dialogAction: 'edit',
    currentStudent: {}
  }),
  computed: {
    // filteredList () {
    //   let filteredStudents = this.students
    //   if (this.param && this.filterBy) {
    //     filteredStudents = this.students.filter((student) => {
    //       if (this.param && this.filterBy === 'name') {
    //         return student.name.toLowerCase() === this.param.toLowerCase()
    //       } else if (this.param && this.filterBy === 'id') {
    //         return student.id.toLowerCase() === this.param.toLowerCase()
    //       }
    //     })
    //   } else {
    //     filteredStudents = this.students
    //   }
    //   return filteredStudents
    // }
  },
  mounted () {
    if (this.$store.state.students.length > 0) {
      this.students = this.$store.state.students
    } else {
      this.fetchStudents()
    }
  },
  methods: {
    filterByName () {
      this.filterBy = 'name'
      this.param = this.studentName
    },
    async fetchStudents () {
      const students = await this.$axios.$get('/students/')
      this.$store.dispatch('updateStudent', students)
      this.students = students
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
