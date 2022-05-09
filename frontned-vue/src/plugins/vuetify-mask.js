import Vue from 'vue'
import VuetifyMask from 'vuetify-mask'

Vue.use(VuetifyMask)

export default VuetifyMask

const MONEY_MASK = {
  props: {
    prefix: '$',
    clearable: true,
    placeholder: ''
  },
  opts: {
    locale: 'en',
    length: 10,
    precision: 2,
    empty: null
  }
}

const MASKS = {
  get money () {
    return {
      bind: MONEY_MASK,
      props: MONEY_MASK.props,
      opts: MONEY_MASK.opts
    }
  },
}

function Mask () {
  return Object.assign({}, MASKS)
}

export { Mask }
