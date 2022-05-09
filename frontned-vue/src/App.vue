<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>PRUEBA TÉCNICA PARA EL CARGO ANALISTA DE DESARROLLO PHP</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-sheet
        color="primary"
        class="pa-4"
      >
        <v-avatar
          class="mb-4"
          color="grey darken-1"
          size="64"
        >
         <img
            src="https://avatars.githubusercontent.com/u/25647752?v=4"
            alt="BRACODEV"
          >
        </v-avatar>
          <p class="font-weight-bold white--text">Brayan Rincón</p>
          <p class="font-weight-bold white--text">brayan262@gmail.com</p>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="(item, index) in links"
          :key="index"
          link
          @click="goto(item.path)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    cards: ['Today', 'Yesterday'],
    drawer: null,
    links: [
      {icon: 'mdi-book-open-page-variant-outline', text: 'Books', path: '/books'},
    ],
  }),

  methods: {
    goto(path) {
      this.$router.push(path)
    }
  }
};
</script>
