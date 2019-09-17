export class ProcessingErrors {
  constructor () {
    this.errors = {
      '': [],
    }
  }

  add (id, msg) {
    if (!msg) {
      msg = id
      id = ''
    }
    this.errors[id] = this.errors[id] || []
    this.errors[id].push(msg)

    this.notEmpty = true
  }

  _format ({ id, msg }) {
    return id ? `${id}: ${msg}` : msg
  }

  toObject () {
    return this.notEmpty ? this.errors : null
  }

  toStringArray () {
    let e = [ ...this.errors[''].map(msg => this._format({ msg })) ]
    Object.keys(this.errors).forEach(id => {
      if (id) {
        e = e.concat(...this.errors[id].map(msg => this._format({ id, msg })))
      }
    })
    return e
  }
}
