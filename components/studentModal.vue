<template>
  <v-container grid-list-md>
    <v-dialog
      v-model="show"
      persistent
      max-width="360"
    >
      <v-card>
        <v-alert v-model="showAlert" color="error">{{ alertMessage }}</v-alert>
        <v-card-title class="headline">
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="name" label="Name" required />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="email" label="Email" required />
            </v-flex>
            <v-flex xs12>
              <v-layout>
                <v-flex xs8>
                  <v-text-field v-model="matricNumber" label="Matric No" required />
                </v-flex>
                <v-flex xs4>
                  <v-select v-model="sex" :items="gender" label="Sex" required />
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            @click="closeModal"
          >
            Cancel
          </v-btn>

          <v-btn
            color="blue-grey"
            :disabled="isFormValid"
            @click="submitAction"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean
    },
    action: {
      type: String,
      default: 'add'
    },
    student: {
      type: Object,
      default () {

      }
    }
  },
  data: () => ({
    name: '',
    matricNumber: '',
    email: '',
    sex: '',
    gender: ['M', 'F'],
    showAlert: false,
    alertMessage: ''
  }),
  computed: {
    dialogTitle () {
      if (this.action === 'edit') {
        return 'Edit students info'
      } return 'Add new student'
    },
    // Disables save button if these fields are empty
    isFormValid () {
      if (this.name && this.matricNumber && this.email && this.gender && this.sex) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    show (val) {
      if (this.action === 'edit') {
        if (this.student) {
          this.updateDetails(this.student)
        }
      } else {
        this.clearForm()
      }
    }
  },
  mounted () {
    this.clearForm()
  },
  methods: {
    async submitAction () {
      if (this.action === 'add') {
        await this.$axios.post('/students/', {
          gender: this.sex,
          full_name: this.name.toLowerCase(),
          email: this.email.toLowerCase(),
          matric_no: this.matricNumber.toLowerCase()
        }).then((res) => {
          this.clearForm()
          this.$emit('savedStudent')
          this.$emit('hideDialog')
          this.showAlert = false
        }).catch((err) => {
          this.showAlert = true
          this.alertMessage = err.response.data[Object.keys(err.response.data)[0]][0]
        })
      } else {
        await this.$axios.put(`/students/${this.student.id}/`, {
          gender: this.sex,
          full_name: this.name,
          email: this.email,
          matric_no: this.matricNumber
        }).then((res) => {
          this.clearForm()
          this.$emit('savedStudent')
          this.$emit('hideDialog')
          this.showAlert = false
        }).catch((err) => {
          this.showAlert = true
          this.alertMessage = err.response.data[Object.keys(err.response.data)[0]][0]
        })
      }
    },
    closeModal () {
      this.$emit('hideDialog')
      this.showAlert = false
    },
    clearForm () {
      this.sex = ''
      this.name = ''
      this.email = ''
      this.matricNumber = ''
    },
    updateDetails (details) {
      this.sex = details.gender
      this.name = details.full_name
      this.email = details.email
      this.matricNumber = details.matric_no
    }
  }
}
</script>
