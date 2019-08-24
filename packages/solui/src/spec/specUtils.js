import { _ } from '../utils'

export const inputIsPresent = (ctx, key) => (
  Object.keys(_.get(ctx, 'inputs', {})).includes(key)
)

export const methodArgExists = (methodAbi, argId) => (
  !!methodAbi.inputs.find(({ name }) => name === argId)
)

export const getAbi = (ctx, contractId) => {
  const { abi } = ctx.artifacts[contractId]
  return abi
}

export const getBytecode = (ctx, contractId) => {
  const { bytecode } = ctx.artifacts[contractId]
  return bytecode
}

export const getMethod = (ctx, contractId, methodName) => {
  const { abi } = ctx.artifacts[contractId]
  return abi.find(def => (
    'constructor' === methodName
      ? (def.type === 'constructor')
      : (def.name === methodName && def.type === 'function')
  ))
}

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
