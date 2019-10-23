<template>
  <v-container grid-list-md>
    <v-card class="search-options">
      <v-layout wrap align-center justify-center>
        <v-flex sm4>
          <v-layout wrap align-center justify-center>
            <v-flex sm8>
              <v-text-field
                v-model="studentId"
                label="ID"
                required
              />
            </v-flex>
            <v-flex sm4>
              <v-btn color="blue-grey">
                <v-icon left>
                  mdi-magnify
                </v-icon> By ID
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm4>
          <v-layout wrap align-center justify-center>
            <v-flex sm8>
              <v-text-field
                v-model="studentName"
                label="Name"
                required
              />
            </v-flex>
            <v-flex sm4>
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
                v-model="course"
                :items="courses"
                label="Courses"
                required
              />
            </v-flex>
            <v-flex sm5>
              <v-btn color="error">
                <v-icon left>
                  mdi-magnify
                </v-icon> By course
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
            <img v-if="student.sex=='M'" src="/icons/man.png" alt="">
            <img v-else src="/icons/woman.png" alt="">
          </div>
          <p class="student__name">
            {{ student.name }}
          </p>
          <v-layout wrap justify-center>
            <v-flex sm4>
              <v-btn>
                <v-icon color="info">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-flex>
            <!-- <v-flex sm4>
              <v-btn>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-flex> -->
            <v-flex sm4>
              <v-btn>
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
        <v-btn fab fixed bottom right v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Add student</span>
    </v-tooltip>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    studentId: '',
    studentName: '',
    courses: ['CPE523', 'CPE524', 'CPE525', 'CPE525', 'EEE522'],
    course: '',
    students: [
      {
        name: 'Abdul',
        sex: 'M'
      },
      {
        name: 'Deven',
        sex: 'M'
      },
      {
        name: 'Emjaay',
        sex: 'F'
      },
      {
        name: 'Gami',
        sex: 'M'
      },
      {
        name: 'Ismo',
        sex: 'F'
      },
      {
        name: 'Mensaah',
        sex: 'M'
      },
      {
        name: 'Deven',
        sex: 'M'
      },
      {
        name: 'Emjaay',
        sex: 'F'
      },
      {
        name: 'Gami',
        sex: 'M'
      }
    ]
  })
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
