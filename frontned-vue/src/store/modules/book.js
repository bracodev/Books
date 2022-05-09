import BookService from "@/services/BookService"
import Vue from "vue"

const BOOK = {

  namespaced: true,

  state: {

    service: new BookService(),

    /** @var {Array<Object>} items Records */
    items: [],

    loadings: {
      getting: false,
      saving: false
    },

    pagination: {
    /** @var {Number} current_page Current Page */
      current_page: 1,

      /** @var {Number} Record per page */
      per_page: 5,

      /** @var {Number} from From page */
      from: 1,

      /** @var {Number} to To page */
      to: 1,

      /** @var {Number} total Total records */
      total: 0,

      /** @var {Number} current_page Current Page */
      current_record: null
    },
  },

  getters: {
    // Getter para obtener la lista de objetos
    data: (state) => {
      return state.items
    },

    getting: (state) => {
      return state.getting
    },

    saving: (state) => {
      return state.saving
    },
  },

  actions: {
    /**
     * Obtener todos los registro
     *
     * @param {Object} commit
     * @returns {Promise} res
     */
    async paginate (context, params) {
      return new Promise((resolve, reject) => {

        context.state.service
          .paginate(params)
          .then((resp) => {
            context.commit('SET_DATA_PAGINATE', resp)
            context.commit('RESPONSE', 'getting')
            resolve(resp)
          }) // then
          .catch((error) => {
            console.log(error)
            context.commit('RESPONSE', 'getting')
            reject(error)
          }) // catch

      }) // Promise
    }, //. paginate
  },
  mutations: {

    /**
     * El que el servidor ha respondido
     *
     * @param {Object} state
     * @param {Number} payload Estatus del load
     */
    RESPONSE: (state, payload) => {
      Vue.set(state.loadings, payload, false)
    },

    // Mutation para setear el listado de objetos
    SET_DATA_PAGINATE: (state, response) => {
      if (response !== undefined) {
        const data = response.data

        state.items = [...data.data]
        state.filtered = [...data.data]

        Vue.set(state.pagination, 'current_page', data.current_page)
        Vue.set(state.pagination, 'per_page', data.per_page)
        Vue.set(state.pagination, 'from', data.from)
        Vue.set(state.pagination, 'to', data.to)
        Vue.set(state.pagination, 'total', data.total)
        Vue.set(state.pagination, 'links', data.links)
        Vue.set(state.pagination, 'path', data.path)

      } else state.items = []
    },

  }
}

export default BOOK
