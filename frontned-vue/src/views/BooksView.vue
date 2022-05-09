<template>
  <div>
    <Card
      title="Books"
      subtitle="Book manager"
      icon="mdi-book-outline"
      :fullHeader="false"
    >
      <v-data-table
        elevation="0"
        dense
        :headers="headers"
        :items="data"
        :search="dtSearch"
        :server-items-length="dtTotalItems"
        :options.sync="dtOptions"
        :loading="loading"
        loading-text="Loading"
        :single-expand="false"
        :expanded.sync="expanded"
        item-key="id"
        show-expand
      >
        <template v-slot:item.actions="{ item }">
          <ActionButtom type="view" v-on:click="show(item)" />

          <ActionButtom type="edit" v-on:click="edit(item)" />

          <ActionButtom type="delete" v-on:click="destroy(item)" />
        </template>
      </v-data-table>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card.vue";
import ActionButtom from "@/components/ActionButtom.vue";

export default {
  name: "BooksView",
  components: {
    Card,
    ActionButtom,
  },

  data: () => ({
    headers: [
      'title',
      'edithor',
      'edition',
      'publishing',
      'cost',
      'amount',
      'rating',
      'rating_notes'
    ],
    loading: false,
    dtSearch: "",
    dtTotalItems: 0,
    data: [],
    expanded: [],
    dtOptions: {},
  }),
};
</script>
