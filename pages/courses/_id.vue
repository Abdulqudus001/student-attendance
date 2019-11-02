<template>
  <v-container grid-list-md>
    <div hidden>
      {{ getBGColor }}
    </div>
    <v-layout wrap>
      <v-flex sm12>
        <v-card>
          <v-card-title>
            Attendance History
          </v-card-title>
          <v-card-text>
            Add course attendance history chart here. Install highcharts and websockets for that
            <highcharts :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm12>
        <v-layout wrap>
          <v-flex sm5>
            <v-card>
              <v-card-title>
                Show Top 5 regular students
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="desserts"
                  hide-default-footer
                  class="elevation-1"
                >
                  <template v-slot:item.image="{ item }">
                    <v-avatar>
                      <img
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        alt="John"
                      >
                    </v-avatar>
                  </template>
                </v-data-table>
                This should display a table showing student
                image, name, and attendance percentage
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex sm7>
            <v-card>
              <v-card-title>
                Last Lecture
              </v-card-title>
              <v-card-text>
                The table would show the latest attendance being taken
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          absolute
          right
          bottom
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Start Attendance</span>
    </v-tooltip>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
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
            text: 'Custom with <b>simple</b> <i>markup</i>',
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
          categories: [1, 2, 3, 4, 5, 6, 7, 8],
          title: {
            enabled: true,
            text: 'Custom with <b>simple</b> <i>markup</i>',
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
          data: [34, 52, 13, 45, 50, 29, 52, 60] // sample data
        }]
      },
      headers: [
        {
          text: 'S/No',
          align: 'left',
          sortable: false,
          value: 'id',
        },
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
          text: '% Present',
          value: 'present',
          sortable: false
        }
      ],
      desserts: [
        {
          id: 1,
          image: 159,
          name: 'Frozen Yogurt',
          present: 24
        },
        {
          id: 2,
          image: 237,
          name: 'Ice cream sandwich',
          present: 37
        },
        {
          id: 3,
          image: 262,
          name: 'Eclair',
          present: 23
        },
        {
          id: 4,
          image: 305,
          name: 'Cupcake',
          present: 67
        },
        {
          id: 5,
          image: 356,
          name: 'Gingerbread',
          present: 49
        },
      ]
    }
  },
  computed: {
    getBGColor () {
      this.updateColorScheme()
      return this.$vuetify.theme.dark ? 'blue' : 'red'
    }
  },
  methods: {
    updateColorScheme () {
      if (this.$vuetify.theme.dark) {
        this.chartOptions.yAxis.title.style.color = '#fff'
        this.chartOptions.yAxis.labels.style.color = '#fff'
        this.chartOptions.xAxis.title.style.color = '#fff'
        this.chartOptions.xAxis.labels.style.color = '#fff'
        this.chartOptions.title.style.color = '#fff'
        this.chartOptions.legend.itemStyle.color = '#fff'
      } else {
        this.chartOptions.yAxis.title.style.color = '#333'
        this.chartOptions.yAxis.labels.style.color = '#333'
        this.chartOptions.xAxis.title.style.color = '#333'
        this.chartOptions.xAxis.labels.style.color = '#333'
        this.chartOptions.title.style.color = '#333'
        this.chartOptions.legend.itemStyle.color = '#333'
      }
    },
    getColor (image) {
      if (image > 400) {
        return 'red'
      } else if (image > 200) {
        return 'orange'
      } else {
        return 'green'
      }
    }
  }
}
</script>
