import { ProcessingErrors } from './errors'

const DEFAULT_CALLBACKS = {
  startUi: async () => {},
  endUi: async () => {},
  startGroup: async () => {},
  endGroup: async () => {},
  startPanel: async () => {},
  endPanel: async () => {},
  getInput: async () => {},
  deployContract: async () => {},
  callMethod: async () => {},
  sendTransaction: async () => {},
}

class Context {
  constructor (id, parentContext) {
    this._parentContext = parentContext
    this._id = parentContext ? `${parentContext.id}.${id}` : id

    ;[
      'artifacts',
      'errors',
      'inputs',
      'callbacks',
      'web3',
    ].forEach(p => {
      this[p] = () => (this[`_${p}`] ? this[`_${p}`] : this._parentContext[p]())
    })
  }

  get id () {
    return this._id
  }

  setOutput (value) {
    if (this._parentContext) {
      this._parentContext.setOutput(value)
    } else {
      this._output = value
    }
  }

  createChildContext (id) {
    return new Context(id, this)
  }
}

class GroupContext extends Context {
  constructor (id, parentContext) {
    super(id, parentContext)
    this._inputs = {}
  }

  createChildContext (id) {
    return new Context(id, this)
  }
}

export class RootContext extends Context {
  constructor (id, { web3, artifacts, inputs, callbacks }) {
    super(id)
    this._web3 = web3
    this._artifacts = artifacts
    this._errors = new ProcessingErrors()
    this._inputs = inputs
    this._callbacks = { ...DEFAULT_CALLBACKS, ...callbacks }
    this._output = null
  }

  createGroupContext (id) {
    return new GroupContext(id, this)
  }

  output () {
    return this._output
  }
}
