import HttpClient from './HttpClient'
import { trailingSlash } from './Helpers'

const API_URL = process.env.VUE_API_URL

export default class ServiceBase {
  /**
   * @param {String} serviceProvider Service provider
   * @private
   **/
  _serviceProvider = '';

  /**
   * @param {String} storeName Module name in the store
   * @private
   **/
  _storeName = '';

  /**
   * @param {Boolean} authRequired Required auth
   * @private
   **/
  _authRequired = false;

  _baseUrl = '';

  _apiVersion;

  _csrfToken;

  _lastQuery;

  _http;

  /**
   * Constructor
   * @constructor
   *
   * @param {String} serviceProvider Services provider name
   * @param {String} storeName Store Name. Optional
   * @param {Boolean} authRequired Indicates if this endpoint is protected by authentication. Default "false". Optional
   */
  constructor (serviceProvider, storeName = false, authRequired = false) {
    if (!serviceProvider) throw new Error('No service providers provided')

    this._serviceProvider = serviceProvider
    this._storeName = storeName || serviceProvider
    this._authRequired = authRequired
    this._baseUrl = trailingSlash(API_URL)

    this.#initHttp()

    this.checkToken()
  }

  /**
   *
   */
  #initHttp () {
    this._http = HttpClient.http

    this._http.defaults.baseURL = this._baseUrl
  }

  /**
   *
   */
  checkToken () {
    const authToken = ls.get('auth-token', false) || false
    if (authToken) {
      HttpClient.addDefaultHeader(
        'Authorization',
        `Bearer ${authToken}`
      )
    }
  }

  /**
   *
   */
  get http () {
    return this._http
  }

  /**
   *
   */
  set http (value) {
    this._http(value)
  }

  /**
   * Get Services provider name
   *
   * @property
   * @readonly
   *
   * @returns {String}
   */
  get serviceProvider () {
    return this._serviceProvider
  }

  /**
   * NO USE
   * @deprecated
   * @param {String} serviceProvider Service Provider
   * @returns
   */
  endpoint (serviceProvider = '', params = {}) {
    const p = this.createParamsURL(params)
    return `${serviceProvider}${p}`
  }

  /**
   *
   * @param {String} url Server URL to use for the request
   * @param {Object} params Optional URL parameters sent by GET. Optional
   * @returns
   */
  resource (url = '', params = {}) {
    this._lastQuery = url
    const p = this.createParamsURL(params)
    return `${this.serviceProvider}/${url}${p}`
  }

  /**
   *
   * @param {Object} params
   * @returns
   */
  createParamsURL (params) {
    let _params = ''

    if (params != null) {
      _params = '?'
      for (const [key, value] of Object.entries(params)) {
        if (value) _params += `${key}=${value}&`
      }
    }

    return _params.substring(0, _params.length - 1)
  }

  /**
   * Handle Errors
   * @param {*} error
   */
  handleErrors (error) {
    const ex = {
      service: this._serviceProvider,
      lastUrl: this._lastQuery,
      exception: error
    }
    console.log(ex) // console
    return ex
  }
}
