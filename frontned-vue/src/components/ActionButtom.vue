<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        class="p-1 mr-1"
        :loading="loading"
        v-bind="{...attrs, ...$attrs}"
        v-on="on"
        v-on:click="click(item)"
      >
        <v-icon v-if="type == 'view'" class="default">mdi-magnify</v-icon>
        <v-icon v-else-if="type == 'edit'"  class="default">mdi-square-edit-outline</v-icon>
        <v-icon v-else-if="type == 'delete'"  class="default">'mdi-trash-can-outline'</v-icon>
        <v-icon v-else>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span v-if="type == 'view'">View record</span>
    <span v-else-if="type == 'edit'">Edit record</span>
    <span v-else-if="type == 'delete'">Delete record</span>
    <span v-else>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>


export default {

  name: 'ActionButtom',

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    item: Object,
    type: String,
    icon: String,
    tooltip: String,
    colorIcon: String,
  },

  methods: {
    click (item) {
      this.$emit('click', item)
    }
  }
}
</script>
