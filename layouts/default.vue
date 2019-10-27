<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      fixed
      app
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-on="on" />
        </template>
        <span>Hide Navigation</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            @click.stop="miniVariant = !miniVariant"
            v-on="on"
          >
            <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-btn>
        </template>
        <span>Shrink Navigation</span>
      </v-tooltip>
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon @click="$vuetify.theme.dark=!$vuetify.theme.dark" v-on="on">
            <v-icon>mdi-lightbulb</v-icon>
            <!-- <v-icon v-else>mdi-lightbulb-outline</v-icon> -->
          </v-btn>
        </template>
        <span>Toggle Dark Mode</span>
      </v-tooltip>
      <!-- <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-book-open-page-variant',
          title: 'Courses',
          to: '/'
        },
        {
          icon: 'mdi-account-supervisor',
          title: 'Students',
          to: '/students'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Fuskar'
    }
  },
  computed: {
    isDarkModeActive () {
      return this.$vuetify.theme.dark
    }
  }
}
</script>
