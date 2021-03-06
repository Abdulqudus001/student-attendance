<template>
  <v-container grid-list-md>
    <div hidden>
      {{ getBGColor }}
    </div>
    <custom-loader v-show="showLoader" />
    <v-layout wrap>
      <v-flex sm12>
        <v-card>
          <v-card-title>
            Attendance History
          </v-card-title>
          <v-card-text>
            <highcharts :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm12>
        <v-layout wrap>
          <v-flex sm12>
            <v-card>
              <v-card-title>
                <span>Previous Lecture Records</span>
                <v-spacer />
                <v-select
                  v-model="lectureModel"
                  :items="lectures"
                  label="Lectures"
                  @change="changeLecture"
                />
                <v-btn icon @click="deleteLecture">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-layout>
                  <v-flex sm5>
                    <highcharts :options="mainDashboardPieData" />
                  </v-flex>
                  <v-flex sm7>
                    <v-data-table
                      :headers="lectureHeaders"
                      :items="getSelectedLectureData"
                      :items-per-page="6"
                      class="elevation-1"
                    >
                      <template v-slot:item.attendance="{ item }">
                        <v-chip
                          :color="item.attendance ? 'info': 'error'"
                        >
                          {{ item.attendance ? 'Present' : 'Absent' }}
                        </v-chip>
                      </template>
                      <template v-slot:item.full_name="{ item }">
                        {{ item.full_name | capitalize }}
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex sm12>
        <v-card>
          <v-card-title>
            Attendance Overview
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="tableData"
              class="elevation-1"
            >
              <template v-slot:item.image="{ item }">
                <v-avatar>
                  <img :src="item.image" :alt="item.name">
                </v-avatar>
              </template>
              <template v-slot:item.name="{ item }">
                {{ item.name | capitalize }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showLectureModal" max-width="900" persistent>
      <v-card>
        <v-card-text>
          <v-layout wrap>
            <v-flex sm5>
              <highcharts :options="pieData" />
            </v-flex>
            <v-flex sm7>
              <p class="title">00
                Student Attendance
              </p>
              <v-data-table
                :headers="lectureHeaders"
                :items="lectureData"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.attendance="{ item }">
                  <v-chip
                    :color="item.attendance ? 'info': 'error'"
                  >
                    {{ item.attendance ? 'Present' : 'Absent' }}
                  </v-chip>
                </template>
                <template v-slot:item.full_name="{ item }">
                  {{ item.full_name | capitalize }}
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            text
            @click="showEndLectureDialog = true"
          >
            Stop Attendance
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          fixed
          right
          bottom
          v-on="on"
          @click="startLecture"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Start Attendance</span>
    </v-tooltip>
    <v-dialog v-model="showEndLectureDialog" persistent max-width="280">
      <v-card>
        <v-card-title>Are you sure you want to end this attendance??</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-grey"
            text
            @click="showEndLectureDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            text
            @click="endLecture"
          >
            End Now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEndLectureDialog" persistent max-width="280">
      <v-card>
        <v-card-title>Are you sure you want to remove this lecture record??</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-grey"
            text
            @click="showDeleteLectureDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            text
            @click="endLecture"
          >
            End Now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CustomLoader from '~/components/loader.vue'
export default {
  components: { CustomLoader },
  data () {
    return {
      pieData: {
        chart: {
          backgroundColor: this.getBGColor,
          type: 'pie'
        },
        title: {
          text: 'Student Emotions Chart',
          style: {
            color: '#fff'
          }
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: true
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            minSize: 80,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Emotion',
          colorByPoint: true,
          data: [
            {
              name: 'calm',
              y: 0
            },
            {
              name: 'surprise',
              y: 0
            },
            {
              name: 'anger',
              y: 0
            },
            {
              name: 'fear',
              y: 0
            }
          ]
        }]
      },
      mainDashboardPieData: {
        chart: {
          backgroundColor: this.getBGColor,
          type: 'pie'
        },
        title: {
          text: 'Emotions',
          style: {
            color: '#fff'
          }
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: true
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            minSize: 80,
            dataLabels: {
              enabled: false,
              format: '{point.name}: {point.percentage:.1f} %',
              style: {
                color: '#fff'
              }
            }
          }
        },
        series: [{
          name: 'Emotions',
          colorByPoint: true,
          data: [
            {
              name: 'calm',
              color: '#2196f3',
              y: 0,
            },
            {
              name: 'surprise',
              color: '#607d8b',
              y: 0
            },
            {
              name: 'anger',
              color: '#f04d50',
              y: 0
            },
            {
              name: 'fear',
              y: 0
            }
          ]
        }]
      },
      chartOptions: {
        chart: {
          type: 'line',
          backgroundColor: this.getBGColor
        },
        title: {
          text: 'Student Attendance Rate',
          style: {
            color: '#fff'
          }
        },
        credits: {
          enabled: false
        },
        yAxis: {
          title: {
            enabled: true,
            text: 'No of Students present',
            style: {
              fontWeight: 'normal',
              color: '#fff'
            }
          },
          labels: {
            style: {
              color: '#fff'
            }
          }
        },
        xAxis: {
          categories: [],
          title: {
            enabled: true,
            text: 'List of Lectures',
            style: {
              fontWeight: 'normal',
              color: '#fff'
            }
          },
          labels: {
            style: {
              color: '#fff'
            }
          }
        },
        legend: {
          itemStyle: {
            color: '#fff'
          }
        },
        series: [{
          name: 'Students Present',
          data: [] // sample data
        }]
      },
      headers: [
        {
          text: 'Image',
          value: 'image',
          sortable: false
        },
        {
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'No of classes attended',
          value: 'classes',
          sortable: false
        },
        {
          text: '% Present',
          value: 'attendanceRate',
          sortable: false
        }
      ],
      tableData: [
        {
          image: 159,
          name: 'Frozen Yogurt',
          attendanceRate: 24
        },
        {
          image: 237,
          name: 'Ice cream sandwich',
          present: 37
        },
        {
          image: 262,
          name: 'Eclair',
          present: 23
        },
        {
          image: 305,
          name: 'Cupcake',
          present: 67
        },
        {
          image: 356,
          name: 'Gingerbread',
          present: 49
        },
      ],
      lectureHeaders: [
        {
          text: 'Matric No',
          align: 'left',
          sortable: false,
          value: 'matric_no',
        },
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'full_name',
        },
        {
          text: 'Attendance',
          align: 'left',
          sortable: false,
          value: 'attendance',
        },
      ],
      lectureData: [],
      websocket: '',
      lectureID: 0,
      registeredStudents: [],
      showLectureModal: false,
      courseLectures: [],
      selectedLecture: 0,
      lectureModel: 'Lecture 1',
      lectures: [0, 1, 2, 3, 4],
      showEndLectureDialog: false,
      selectedLectureID: 0,
      showDeleteLectureDialog: false,
      showLoader: false
    }
  },
  computed: {
    getBGColor () {
      this.updateColorScheme()
      return this.$vuetify.theme.dark ? 'blue' : 'red'
    },
    getSelectedLectureData () {
      let selectedLecture = []
      if (this.courseLectures.length > 0) {
        selectedLecture = this.courseLectures[this.selectedLecture] ? this.courseLectures[this.selectedLecture].attendanceRecord : []
        // Function is called from here to enable auto update immediately data comes in
        this.generateChartData(this.courseLectures)
        // Get student with images data
        if (this.courseLectures.length === this.lectures.length) {
          this.getStudentImages(this.courseLectures, this.registeredStudents)
        }
      }
      return selectedLecture
    }
  },
  mounted () {
    this.getCourses()
  },
  methods: {
    changeLecture (e) {
      this.selectedLecture = parseInt((e.split(' ')[1]) - 1)
      this.selectedLectureID = this.courseLectures[this.selectedLecture].lectureID
      this.mainDashboardPieData.series[0].data = this.courseLectures[this.selectedLecture].emotions
      this.mainDashboardPieData.title.text = `Emotions for ${this.lectureModel}`
    },
    getLectures () {
      this.courseLectures = []
      this.$axios.get(`/courses/${this.$route.params.id}/lectures/`).then((success) => {
        const lectures = success.data.map((data, index) => {
          return `Lecture ${index + 1}`
        })
        this.lectures = lectures
        const sorted = success.data.sort((a, b) => {
          return a.id - b.id
        })
        sorted.forEach((data) => {
          this.showLoader = true
          this.$axios.get(`/lectures/${data.id}/`).then((success) => {
            const data = success.data
            const emotions = this.getPieChartData(data.emotions)
            const studentAttendance = this.registeredStudents.map((stu) => {
              if (data.students_present.includes(stu.id)) {
                return { ...stu, attendance: true }
              } else {
                return { ...stu, attendance: false }
              }
            })
            this.courseLectures.push({ lectureID: data.id, attendanceRecord: studentAttendance, emotions })
            this.courseLectures.sort((a, b) => {
              return a.lectureID - b.lectureID
            })
            this.selectedLectureID = this.courseLectures[0].lectureID
            this.mainDashboardPieData.series[0].data = this.courseLectures[0].emotions
            this.mainDashboardPieData.title.text = `Emotions for ${this.lectureModel}`
            this.showLoader = false
          }).catch((err) => {
            this.showLoader = false
            console.log(err)
          })
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    getCourses () {
      this.showLoader = true
      this.$axios.get('/courses/').then((success) => {
        const courses = success.data
        const selectedCourse = courses.find((course) => {
          return course.id.toString() === this.$route.params.id.toString()
        })
        this.getStudents(selectedCourse.registered_students)
      }).catch((err) => {
        console.log(err)
        this.showLoader = false
      })
    },
    getStudents (registeredStudents) {
      this.$axios.get('/students/').then((success) => {
        const students = success.data
        this.registeredStudents = students.filter((student) => {
          return registeredStudents.includes(student.id)
        })
        this.lectureData = this.registeredStudents
        this.getLectures()
      })
    },
    deleteLecture () {
      this.$axios.delete(`/lectures/${this.selectedLectureID}/`).then((success) => {
        this.getCourses()
        this.changeLecture('Lecture 1')
      })
    },
    updateColorScheme () {
      if (this.$vuetify.theme.dark && this.chartOptions) {
        this.chartOptions.yAxis.title.style.color = '#fff'
        this.chartOptions.yAxis.labels.style.color = '#fff'
        this.chartOptions.xAxis.title.style.color = '#fff'
        this.chartOptions.xAxis.labels.style.color = '#fff'
        this.chartOptions.title.style.color = '#fff'
        this.chartOptions.legend.itemStyle.color = '#fff'
        this.pieData.title.style.color = '#fff'
        this.mainDashboardPieData.title.style.color = '#fff'
      } else if (!this.$vuetify.theme.dark && this.chartOptions) {
        this.chartOptions.yAxis.title.style.color = '#333'
        this.chartOptions.yAxis.labels.style.color = '#333'
        this.chartOptions.xAxis.title.style.color = '#333'
        this.chartOptions.xAxis.labels.style.color = '#333'
        this.chartOptions.title.style.color = '#333'
        this.chartOptions.legend.itemStyle.color = '#333'
        this.pieData.title.style.color = '#333'
        this.mainDashboardPieData.title.style.color = '#333'
      }
    },
    startLecture () {
      this.showLectureModal = true
      this.$axios.post('/lectures/', {
        course: this.$route.params.id
      }).then((success) => {
        this.lectureID = success.data.id
        this.startSocket(success)
      }).catch((err) => {
        console.log(err)
      })
    },
    endLecture () {
      this.$axios.post(`/lectures/${this.lectureID}/end/`, {
        id: this.lectureID
      }).then((success) => {
        this.websocket.close()
        this.showEndLectureDialog = false
        this.getCourses()
      }).catch((err) => {
        console.log(err)
      })
    },
    startSocket (success) {
      const that = this
      const wsUri = `ws://192.168.122.1:8000/ws/lectures/${success.data.id}`
      this.websocket = new WebSocket(wsUri)
      this.websocket.onopen = function (evt) {
        console.log('Socket Open')
      }
      this.websocket.onclose = function (evt) {
        console.log(evt)
        that.showLectureModal = false
      }
      this.websocket.onmessage = function (evt) {
        console.log('New Face Captured')
        const presentStudents = JSON.parse(evt.data).students_present
        that.getPieChartData(JSON.parse(evt.data).emotions)
        that.markAttendance(presentStudents)
      }
      this.websocket.onerror = function (evt) {
        console.log(evt)
      }
    },
    // Generate pie chart data
    getPieChartData (data) {
      const pieData = [
        {
          name: 'calm',
          y: 0
        },
        {
          name: 'surprise',
          y: 0
        },
        {
          name: 'anger',
          y: 0
        },
        {
          name: 'fear',
          y: 0
        }
      ]
      if (data.length === 0) {
        return pieData
      }
      pieData.forEach((pie, index) => {
        const chartData = data.filter((item) => {
          return item === pie.name
        })
        pie.y = chartData.length
      })
      this.pieData.series[0].data = pieData
      return pieData
    },
    markAttendance (presentStudents) {
      const lectureData = this.lectureData.map((data) => {
        if (presentStudents.includes(data.id)) {
          return { ...data, attendance: true }
        } else {
          return { ...data, attendance: false }
        }
      })
      this.lectureData = lectureData
    },
    // Generate data for chart
    generateChartData (lectureData) {
      // console.log(lectureData)
      const categories = lectureData.map((lecture, index) => {
        return `Wk ${index + 1}`
      })
      const attendanceHistory = lectureData.map((lecture, index) => {
        const presentStudents = lecture.attendanceRecord.filter((record) => {
          return record.attendance === true
        })
        return presentStudents.length
      })
      if (this.chartOptions) {
        this.chartOptions.xAxis.categories = categories
        this.chartOptions.series[0].data = attendanceHistory
      }
    },
    getStudentImages (lectureData, students) {
      // Get individual student courses and images
      const updatedStudent = []
      students.forEach((student) => {
        this.$axios.$get(`/students/${student.id}/images`).then((res) => {
          const images = res.map((image) => {
            return `${process.env.BASE_URL}${image.file}`
          })
          const newObj = { ...student, image: images[0] }
          updatedStudent.push(newObj)
          this.tableData = this.getStudentAttendanceRate(lectureData, updatedStudent).sort((a, b) => {
            return b.attendanceRate - a.attendanceRate
          })
          // this.tableData = this.tableData.slice(0, 3)
        })
      })
    },
    // Computed data for general lecture statistics
    getStudentAttendanceRate (lectureData, students) {
      const studentsAttendanceRate = students.map((student) => {
        const attendanceHistory = lectureData.map((lecture, index) => {
          const presentStudents = lecture.attendanceRecord.filter((record) => {
            return record.attendance === true && record.id === student.id
          })
          return presentStudents.length
        })
        return {
          name: student.full_name,
          image: student.image,
          classes: attendanceHistory.reduce((acc, a) => acc + a),
          attendanceRate: ((attendanceHistory.reduce((acc, a) => acc + a) / lectureData.length) * 100).toFixed(1)
        }
      })
      return studentsAttendanceRate
    }
  }
}
</script>
