<template>
  <div>
    <Card
      title="Books"
      subtitle="Book manager"
      :icon="icon"
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
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-list subheader three-line>
              <v-list-item
                v-for="(info, index) in recordInfo(item)"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ info.text }}</v-list-item-title>
                  <v-list-item-subtitle>{{ info.value }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </td>
        </template>

        <template v-slot:item.rating="{ item }">
          <v-chip :color="getColor(item.rating)" dark>
            {{ item.rating | capitalize }}
          </v-chip>
        </template>

        <template v-slot:item.publishing="{ item }">
          {{ item.publishing | moment(formatDate) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <ActionButtom type="view" v-on:click="show(item)" />

          <ActionButtom type="edit" v-on:click="edit(item)" />

          <ActionButtom type="delete" v-on:click="destroy(item)" />
        </template>
      </v-data-table>
    </Card>

    <v-dialog v-model="dialog" persistent max-width="550" scrollable>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        v-on:submit.prevent="store"
        v-on:reset="reset"
      >
        <v-card :loading="saving">
          <v-card-title>
            <v-icon dark color="primary" class="mr-4">{{ icon }}</v-icon> Books
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text style="height: 450px" class="v-scroll">
            <v-row dense>
              <v-col cols="12" md="12">
                <v-text-field
                  ref="title"
                  label="Title"
                  required
                  v-model="record.title"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  ref="author"
                  label="Author"
                  required
                  v-model="record.author"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  ref="edithor"
                  label="Edithor"
                  required
                  v-model="record.edithor"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-dialog
                  ref="dialog"
                  v-model="dialogPublishing"
                  :return-value.sync="record.publishing"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="record.publishing"
                      label="Publishing"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="record.publishing" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="dialogPublishing = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(record.publishing)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field-money
                  ref="cost"
                  label="Cost"
                  v-model="record.cost"
                  v-bind:properties="moneyMask.props"
                  v-bind:options="moneyMask.opts"
                ></v-text-field-money>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field-money
                  ref="amount"
                  label="Amount"
                  v-model="record.amount"
                  v-bind:properties="moneyMask.props"
                  v-bind:options="moneyMask.opts"
                ></v-text-field-money>
              </v-col>

              <v-col cols="12">
                <v-rating
                  v-model="rating"
                  hover
                  length="4"
                  size="30"
                  value="4"
                  icon-label="custom icon label text {0} of {1}"
                ></v-rating>
                <v-chip dark>
                  {{ ratingText }}
                </v-chip>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  ref="rating_notes"
                  label="Rating notes"
                  v-model="record.rating_notes"
                  rows="2"
                ></v-textarea>
              </v-col>

            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="default" text> <v-icon>mdi-band</v-icon> Cancel </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text type="submit"> Save <v-icon>mdi-check</v-icon> </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import Card from "@/components/Card.vue";
import ActionButtom from "@/components/ActionButtom.vue";
import moment from "@/plugins/vue-moment";
import { Mask } from '@/plugins/vuetify-mask'

export default {
  name: "BooksView",
  components: {
    Card,
    ActionButtom,
  },

  data: () => ({
    icon: "mdi-book-open-page-variant-outline",

    /** @var {Object} record Current record */
    record: {},

    /** @var {String} formatDate Format date */
    formatDate: "MMM D, YYYY",

    /** @var {Boolean} dialog Dialog record visibility */
    dialog: false,
    dialogPublishing: false,

    /** @var {Boolean} headers Datatable headers*/
    headers: [
      { text: "Title", value: "title" },
      { text: "Edithor", value: "edithor" },
      { text: "Edition", value: "edition", align: "center" },
      { text: "Publishing", value: "publishing" },
      { text: "Cost", value: "cost", align: "center" },
      { text: "Amount", value: "amount", align: "center" },
      { text: "Rating", value: "rating", align: "center" },
      { text: "Actions", value: "actions", align: "center" },
    ],

    valid: true,

    /** @param  {Object | DataOptions} dtOptions Component: v-datatable. DataTable options */
    dtOptions: {},

    /** @param  {String} dtSearch Search filtering model associated with the DataTable */
    dtSearch: null,

    dtTotalItems: 0,

    expanded: [],

    /** @var {Boolean} readOnly */
    readOnly: false,

    /** @var {Object} beforeEdit Record before being edited */
    beforeEdit: {},

    rating: 3
  }),

  computed: {
    data() {
      return this.$store.getters["book/data"];
    },

    loading() {
      return this.$store.getters["book/getting"];
    },

    saving () {
      return this.$store.getters["book/saving"];
    },

    moneyMask () {
      return Mask().money.bind
    },

    ratingText () {
      let text = "";
      switch (this.rating) {
      case 4:
        text = "Extraordinary";
        break;
      case 3:
        text = "Excellent";
        break;
      case 2:
        text = "Good";
        break;
      case 1:
        text = "Damaged";
        break;
      }
      return text
    }

  },

  created() {
    this.getData();
  },

  methods: {
    moment: function () {
      return moment();
    },

    /**
     * Get paginated data from the API based on the DataTable options
     */
    getData() {
      if (this.dtSearch) {
        this.dtOptions.page = 1;
      }

      let {
        page, // number
        itemsPerPage, // number
        sortBy, // string[]
        sortDesc, // boolean[]
      } = this.dtOptions;

      page = page || 1;

      itemsPerPage = itemsPerPage || 5;

      // if (sortBy == 'full_name') sortBy = 'first_name'

      const _this = this;

      this.btnLoadings = {};

      this.$store
        .dispatch("book/paginate", {
          page: page,
          size: itemsPerPage,
          sortBy: sortBy,
          sortDesc: sortDesc,
          search: this.dtSearch,
          columns: this.filterables,
        })
        .then((resp) => {
          _this.dtTotalItems = resp.data.total;
        }) // then
        .catch((error) => {
          console.log("getData()", error);
        }); // catch;
    }, // getData

    show(item) {
      this.record = Object.assign(item);
      this.dialog = true;
    },

    store(e) {

    },

    getColor(rating) {
      let color = "";
      switch (rating) {
      case "extraordinary":
        color = "green";
        break;
      case "excellent":
        color = "blue";
        break;
      case "good":
        color = "orange";
        break;
      case "damaged":
        color = "red";
        break;
      default:
        color = "default";
        break;
      }

      return color;
    },

    recordInfo(item) {
      const resp = [
        {
          text: "Rating notes",
          value: item.rating_notes,
        },
        {
          text: "Date creation",
          value: this.moment(item.created_at, this.formatDate),
        },
        {
          text: "Last updated",
          value: this.moment(item.updated_at, this.formatDate),
        },
      ];

      return resp;
    }, // recordInfo

    reset(e) {
      e.preventDefault();
    },
  },
};
</script>
