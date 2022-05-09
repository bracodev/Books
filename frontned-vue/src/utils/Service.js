import ServiceBase from './ServiceBase'
import store from '@/store'

const POST = 'post'
const GET = 'get'
const PUT = 'put'
const DELETE = 'delete'
const PATH = 'path'

/**
 * Service Class
 *
 * @author Brayan Rincon  <hi@bracodev.com>
 *
 * @class
 * @package Core\Services
 * @extends Core\ServiceBase
 */
export default class Service extends ServiceBase {
  // #region Internal vars

  /**
   * @param {Boolean} #progress Additional configurations of the axios
   * @private
   **/
  #progress = false;

  /**
   * @param {Number} progressUpload State of Progress
   * @private
   **/
  #progressUpload = 0;

  /**
   * @param {Object} #config Additional configurations of the axios
   * @private
   **/
  #config = {};

  // #region

  /**
   * Constructor
   * @constructor
   *
   * @param {String} serviceProvider Services provider name
   * @param {String} storeName Store Name. Optional
   * @param {Boolean} authRequired Indicates if this endpoint is protected by authentication. Default "false". Optional
   */
  constructor (serviceProvider, storeName = false, authRequired = false) {
    super(serviceProvider, storeName, authRequired)

    this.#initConfig()
  } // ./constructor

  /**
   * Initilize Axios settings
   * @private
   * @function
   */
  #initConfig () {
    const _this = this
    this.#config = {
      onUploadProgress: (e) => {
        _this.#progressUpload = Math.round((e.loaded * 100) / e.total)
        store.dispatch(`${_this._storeName}/progress`, _this.#progressUpload)
      }
    }
  }

  // #region Properties

  /**
   * Get progress request
   *
   * @property
   * @readonly
   *
   * @returns {Number}
   */
  get progressUpload () {
    return this.#progressUpload
  }

  /**
   * Get additional authentication headers for Token Bearer
   *
   * @property Authentication headers
   * @readonly
   *
   * @returns {Object} Headers with Bearer Token
   */
  get headerAuth () {
    // const TOKEN = ls.get('auth-token', false) || null
    // return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
    return ''
  }

  // #endregion

  // #region Common

  /**
   * CAUTION: NOT USE
   * Execute a custom API query
   *
   * @deprecated
   *
   * @param {String} url Server URL to use for the request
   * @param {String} method Request method to use when making the request. GET, PUT, POST, DELETE, and PATCH. Default: "get". Optional
   * @param {Object} data Data to be sent as the body of the request. Only applicable for 'PUT', 'POST', 'DELETE' and 'PATCH' request methods. Optional
   * @param {Object} headers Optional additional headers. Optional
   *
   * @returns {Promise} Promise
   */
  async query (url, method = GET, data = {}, headers = {}) {
    // this.http.defaults.baseURL = this.endpoint();

    const self = this
    let config = {
      method: method,
      url: url,
      data: data,
      headers: headers
    }

    if (this.#progress == true) {
      config = {
        ...config,
        ...{ onUploadProgress: this.#config.onUploadProgress }
      }
    }

    return new Promise((resolve, reject) => {
      self
        .http(config)
        .then((response) => {
          self.#progress = false
          resolve(self.processResponse(response))
        })
        .catch((error) => {
          self.#progress = false
          reject(self.processError(error))
        })
    }) // Promise
  } // query

  /**
   * Execute a custom API query
   *
   * @param {String} url Server URL to use for the request
   * @param {Object} URLParams Optional URL parameters sent by GET. Optional
   * @param {String} method Request method to use when making the request. GET, PUT, POST, DELETE, and PATCH. Default: "get". Optional
   * @param {Object} data Data to be sent as the body of the request. Only applicable for 'PUT', 'POST', 'DELETE' and 'PATCH' request methods. Optional
   * @param {Object} headers Optional additional headers
   *
   * @returns {Promise} Promise
   */
  async request (url, URLParams = {}, method = GET, data = {}, headers = {}) {
    const self = this
    let config = {
      method: method,
      url: this.resource(url, URLParams),
      data: data,
      headers: headers
    } // cosnt

    if (this.#progress == true) {
      config = {
        ...config,
        ...{ onUploadProgress: this.#config.onUploadProgress }
      }
    } // request

    return new Promise((resolve, reject) => {
      self
        .http(config)
        .then((response) => {
          self.#progress = false
          resolve(self.processResponse(response))
        }) // then
        .catch((error) => {
          self.#progress = false
          reject(self.processError(error))
        })
    }) // Promise
  } // request

  // #endregion

  // #region CRUD operations

  /**
   * Get all the stored records.
   *
   * Caution: this method can cause instability as
   * it can fetch large volumes of data in a single request
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async all (URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request('', URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  } // all

  /**
   * Obtain the query records in a paged form
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async paginate (URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request('', URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * @deprecated
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async get (id, URLParams = {}, headers = {}) {
    try {
      if (!id) throw Error('Record ID is required')
      return await this.request(id, URLParams, GET, {}, headers)
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Get a record by your ID
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async show (id, URLParams = {}, headers = {}) {
    try {
      if (!id) throw Error('Record ID is required')
      return new Promise((resolve, reject) => {
        this.request(id, URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Create a new record
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async store (data = {}, URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request('', URLParams, POST, data, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Update the data of a record by its ID
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async update (data, URLParams = {}, headers = {}) {
    try {
      // if (!id) throw Error("Record ID is required");
      return new Promise((resolve, reject) => {
        this.request(data.id, URLParams, PUT, data, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Delete a record by its ID. The deleted can be HardDelete or SoftDelete.
   * If it is SoftDelete it can be recovered with the restore method.
   * To see a list of all records deleted with SoftDelete use the trash method
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async destroy (data, URLParams = {}, headers = {}) {
    try {
      if (!data) throw Error('Record ID is required for destroy')

      return new Promise((resolve, reject) => {
        this.request(data, URLParams, DELETE, {}, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Returns a list of all records deleted with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async trash (URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request('trash', URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Returns a paginated list of all records deleted with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async trashPaginate (options = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request('trash', options, GET, {}, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Restore a deleted record with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async restore (data, URLParams = {}, headers = {}) {
    console.log(data)
    try {
      return new Promise((resolve, reject) => {
        this.request('trash', URLParams, PUT, data, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Delete a record permanently, this method is only used with
   * records that are in the recycle bin, that is, with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async forceDelete (data, URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request('trash', URLParams, DELETE, data, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  /**
   * Enabled/disabled records
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async enabled (data, URLParams = {}, headers = {}) {
    const VALUE = { value: data.value }
    try {
      return new Promise((resolve, reject) => {
        this.request(`${data.id}/enabled`, URLParams, PUT, VALUE, headers)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }) // Promise
    } catch (ex) {
      this.handleErrors(ex)
    }
  }

  // #endregion

  /**
   * Progress request
   *
   * @function
   */
  progress () {
    this.#progress = true
    store.dispatch(`${this._storeName}/progress`, 0)
  }

  processResponse (response) {
    /**
     * Respuestas informativas (100–199)
     * Respuestas satisfactorias (200–299)
     * Redirecciones (300–399)
     */
    return response.data
  }

  processError (error) {   
    console.log('Error', error.message)    
  }
}
