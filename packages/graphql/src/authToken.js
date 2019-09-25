export default class AuthToken {
  constructor ({ refreshAuthToken }) {
    this._token = null
    this._refreshAuthToken = refreshAuthToken
  }

  set (token) {
    this._token = token
  }

  get () {
    return this._token
  }

  refresh () {
    return this._refreshAuthToken()
  }
}
