export default class AuthToken {
  setToken (token) {
    this._assertImplementation()
    return this._implementation.set(token)
  }

  getToken () {
    this._assertImplementation()
    return this._implementation.get()
  }

  refreshToken () {
    this._assertImplementation()
    return this._implementation.refresh()
  }

  setImplementation (impl) {
    this._implementation = impl
  }

  _assertImplementation () {
    if (!this._implementation) {
      throw new Error(`AuthToken: implementation not yet set!`)
    }
  }
}
