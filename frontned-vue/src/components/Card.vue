<template>

  <v-card
    v-bind="$attrs"
    class="v-card--material v-crud--material"
  >
    <!-- CARD HEADER -->
    <v-card-title class="mb-4">

      <v-sheet
        class="overflow-hidden transition-swing v-card--material__sheet"
        elevation="6"
        max-width="100%"
        rounded
        color="primary"
        :width="fullHeader ? '100%' : undefined"
      >
        <v-theme-provider
          v-if="hasHeading"
          dark
        >
          <div
            v-if="icon"
            :class="iconSmall ? 'py-3 px-4' : 'pa-3'"
          >
            <v-icon
              :large="!iconSmall"
              v-text="icon"
            />
          </div>

          <slot name="heading" />

          <div
            v-if="heading"
            class="text-h4 white--text pa-7 v-card--material__title"
          >{{ heading }}</div>
        </v-theme-provider>
      </v-sheet>

      <div
        v-if="hasTitle"
        :class="fullHeader ? 'pt-4' : 'pl-3 pt-0 mt-0'"
        class="text-h4 v-card--material__title"
      >
        <slot name="title" />

        <template v-if="title">
          {{ title }}
        </template>

        <div class="text-subtitle-1 mb-n4 v-card--material__subtitle">
          <slot name="subtitle" />
          <template v-if="subtitle">
            {{ subtitle }}
          </template>
        </div>

      </div>

      <v-spacer></v-spacer>

      <!-- ADD BTN -->
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab small
            color="primary"
            class=" mr-4"
            elevation="2"
            v-on:click="create"
            v-bind="attrs" v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Create a new record</span>
      </v-tooltip>

      <!-- SEARCH -->
      <v-text-field
        append-icon="mdi-magnify"
        style="max-width: 200px"
        clearable
        label="Search"
        v-model.trim="search"
        v-on:input="searching"
      ></v-text-field>

    </v-card-title>
    <!-- /CARD HEADER -->

    <slot />

  </v-card>

</template>

<script>


export default {
  name: 'MaterialCard',

  props: {
    title: String,
    subtitle: String,
    fullHeader: Boolean,
    icon: String,
    heading: String,
    iconSmall: Boolean
  },

  computed: {
    hasHeading () {
      return !!(
        this.icon ||
        this.heading ||
        this.$slots.heading
      )
    },

    hasTitle () {
      return !!(
        this.title ||
        this.subtitle ||
        this.$slots.title ||
        this.$slots.subtitle
      )
    },


  },

  data: () => ({
    search: ''
  }),

  created () {

  },

  methods: {
    create () {

    },
    searching () {

    }
  }
}
</script>

<style lang="sass">
  .v-crud--material
    margin-top: 0px !important

    > .v-card__title
      > .v-card--material__title
        flex: 1 1 auto
        word-break: break-word

  .v-crud--material .v-card__title
    padding: 0px 7px !important

  .v-crud--material .v-card--material__title
    font-size: 1.5rem !important
    font-weight: 400
    line-height: 2rem

  .v-crud--material .v-card--material__subtitle
    color: #999999
    font-size: 1rem !important
    font-weight: 300

</style>
