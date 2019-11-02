<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex sm12>
        <v-card>
          <v-card-title>
            Attendance History
          </v-card-title>
          <v-card-text>
            Add course attendance history chart here. Install highcharts and websockets for that
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm12>
        <v-layout wrap>
          <v-flex sm4>
            <v-card>
              <v-card-title>
                Show Top 5 regular students
              </v-card-title>
              <v-card-text>
                This should display a table showing student
                image, name, and attendance percentage
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex sm8>
            <v-card>
              <v-card-title>
                Show Top 5 regular students
              </v-card-title>
              <v-card-text>
                This should display a table showing student
                image, name, and attendance percentage
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
