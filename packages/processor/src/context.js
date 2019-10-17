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
      'outputs',
      'callbacks',
      'web3',
    ].forEach(p => {
      this[p] = () => (this[`_${p}`] ? this[`_${p}`] : this._parentContext[p]())
    })
  }

  get id () {
    return this._id
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
  constructor (id, { web3, artifacts, callbacks }) {
    super(id)
    this._web3 = web3
    this._artifacts = artifacts
    this._errors = new ProcessingErrors()
    this._callbacks = { ...DEFAULT_CALLBACKS, ...callbacks }
    this._outputs = {}
  }

  createGroupContext (id) {
    return new GroupContext(id, this)
  }
}
