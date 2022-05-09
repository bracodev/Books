<template>
  <v-card
    v-on="$listeners"
    v-bind="$attrs"
    class="v-card--material"
  >
    <v-card-title class="align-start">

      <!-- ICONO -->
      <v-sheet
        :color="color ? color : 'primary'"
        :width="fullHeader || fullWidth ? '100%' : undefined"
        class="overflow-hidden transition-swing v-card--material__sheet text-center"
        elevation="4"
        max-width="100%"
        rounded
      >
        <v-theme-provider
          v-if="hasHeading"
          dark
        >
          <div
            v-if="icon != ''"
            :class="iconSmall ? 'py-3 px-4' : 'pa-8 '"
           >
            <v-icon
              :large="!iconSmall"
              v-text="icon"
            />
          </div>

          <slot name="heading" />

          <div
            v-if="heading"
            class="text-h4 white--text pa-7 v-card--material__title text-center"
          >{{ heading }}</div>

        </v-theme-provider>
      </v-sheet>

      <div
        v-if="hasTitle"
        class="pt-0 pl-3 text-h4 v-card--material__title mt-0"
        :class="fullHeader || fullWidth ? 'text-center' : ''"
      >
        <slot name="title" />

        <!-- STATS -->
        <template v-if="title">
          {{ title }}
        </template>

        <div class="text-subtitle-1 mb-n4">
          <!-- STATS -->
          <slot name="subtitle" />

          <template v-if="subtitle">
            {{ subtitle }}
          </template>
        </div>
      </div>
    </v-card-title>

    <slot />

    <template v-if="$slots.actions">
      <v-divider class="mt-2 mx-4" />
      <v-card-actions class="px-4 text-caption grey--text">
        <slot name="actions" />
      </v-card-actions>
    </template>

  </v-card>
</template>

<script>

export default {
  name: 'MaterialCard',

  props: {
    color: String,
    fullHeader: Boolean,
    heading: String,
    icon: String,
    iconSmall: Boolean,
    title: String,
    subtitle: String
  },

  computed: {
    fullWidth () {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs': return true
      case 'sm': return true
      case 'md': return false
      case 'lg': return false
      case 'xl': return false
      }
      return true
    },
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
    }
  }
}
</script>

<style lang="sass">
  .v-card.v-card--material
    > .v-card__title
      > .v-card--material__title
        flex: 1 1 auto
        word-break: break-word
</style>
