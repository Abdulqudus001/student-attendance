<template>
  <v-container grid-list-md>
    <v-dialog
      v-model="show"
      persistent
      max-width="360"
    >
      <v-card>
        <v-card-title class="headline">
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="name" label="Name" />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="description"
                label="Description"
              />
            </v-flex>
            <v-flex xs12>
              <v-layout>
                <v-flex xs5>
                  <v-select
                    v-model="department"
                    :items="departments"
                    label="Department"
                  />
                </v-flex>
                <v-flex xs7>
                  <v-text-field
                    v-model="code"
                    label="Course code"
                  />
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-combobox
                v-model="registeredStudents"
                :items="allStudents"
                chips
                clearable
                label="Select students"
                multiple
                solo
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="remove(item)"
                  >
                    <strong>{{ item }}</strong>&nbsp;
                  </v-chip>
                </template>
              </v-combobox>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="$emit('hideDialog')"
          >
            Cancel
          </v-btn>

          <v-btn
            color="blue-grey"
            :disabled="isFormValid"
            @click="submit"
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
  props: {
    show: {
      type: Boolean
    },
    action: {
      type: String,
      default: 'add'
    },
    course: {
      type: Object,
      default () {

      }
    }
  },
  data: () => ({
    departments: ['CPE', 'CME'],
    department: '',
    code: '',
    name: '',
    description: '',
    registeredStudents: [],
    allStudents: []
  }),
  computed: {
    ...mapState(['students']),
    dialogTitle () {
      if (this.action === 'edit') {
        return 'Edit course info'
      } return 'Add new course'
    },
    // Disables save button if these fields are empty
    isFormValid () {
      if (this.name && this.department && this.code && this.description) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    show (val) {
      if (this.$store.state.students.length <= 0) {
        this.fetchStudents()
      } else {
        this.mapStudents(this.$store.state.students)
      }
      if (this.action === 'edit') {
        if (this.course) {
          this.updateDetails(this.course)
        }
      } else {
        this.clearForm()
      }
    },
  },
  mounted () {
    if (this.$store.state.students.length <= 0) {
      this.fetchStudents()
    } else {
      this.mapStudents(this.$store.state.students)
    }
    // this.clearForm()
  },
  methods: {
    submit () {
      const stds = this.registeredStudents
      const studentIds = stds.map((student, index) => {
        return this.students.find(stu => stu.full_name === student).id
      })
      this.submitAction(studentIds)
    },
    async submitAction (students) {
      if (this.action === 'add') {
        await this.$axios.post('/courses/', {
          department: this.department,
          name: this.name,
          code: this.code,
          description: this.description,
          registered_students: students
        }).then((res) => {
          this.clearForm()
          this.$emit('savedCourse')
        })
        this.$emit('hideDialog')
      } else {
        await this.$axios.put(`/courses/${this.course.id}/`, {
          department: this.department,
          name: this.name,
          code: this.code,
          description: this.description,
          registered_students: students
        }).then((res) => {
          this.clearForm()
          this.$emit('savedCourse')
        })
        this.$emit('hideDialog')
      }
    },
    clearForm () {
      this.department = ''
      this.name = ''
      this.code = ''
      this.description = ''
      this.registeredStudents = []
    },
    getStudentById (students) {
      const studentNames = students.map((student, index) => {
        return this.students.find(stu => stu.id === student).full_name
      })
      return studentNames
    },
    updateDetails (details) {
      this.department = details.department
      this.name = details.name
      this.code = details.code
      this.description = details.description
      this.registeredStudents = this.getStudentById(details.registered_students)
    },
    remove (item) {
      this.registeredStudents.splice(this.registeredStudents.indexOf(item), 1)
      this.registeredStudents = [...this.registeredStudents]
    },
    mapStudents (students) {
      const allStudents = students.map((student) => {
        return student.full_name
      })
      this.allStudents = allStudents
    },
    async fetchStudents () {
      const students = await this.$axios.$get('/students/')
      this.$store.dispatch('updateStudent', students)
      this.mapStudents(students)
    },
  }
}
</script>
