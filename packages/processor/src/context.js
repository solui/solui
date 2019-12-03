import { ProcessingErrors } from './errors'

/**
 * Default dummy callbacks for processor.
 * @type {Object}
 */
const DEFAULT_CALLBACKS = {
  /**
   * Processing of the spec has started.
   * @return {Promise}
   */
  startUi: async () => {},
  /**
   * Processing of the spec has ended.
   * @return {Promise}
   */
  endUi: async () => {},
  /**
   * Processing of a UI group has started.
   * @return {Promise}
   */
  startGroup: async () => {},
  /**
   * Processing of a UI group has ended.
   * @return {Promise}
   */
  endGroup: async () => {},
  /**
   * Processing of a panel has started.
   * @return {Promise}
   */
  startPanel: async () => {},
  /**
   * Processing of a panel has ended.
   * @return {Promise}
   */
  endPanel: async () => {},
  /**
   * Process given user input field and get its current value.
   * @return {Promise}
   */
  processInput: async () => {},
  /**
   * Deploy a contract.
   * @return {Promise}
   */
  deployContract: async () => {},
  /**
   * Call a contract method - `eth_call`.
   * @return {Promise}
   */
  callMethod: async () => {},
  /**
   * Call a contract method via a transaction - `eth_sendTransaction`.
   * @return {Promise}
   */
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
      'node',
    ].forEach(p => {
      this[p] = () => (this[`_${p}`] ? this[`_${p}`] : this._parentContext[p]())
    })
  }

  get id () {
    return this._id
  }

  set id (val) {
    this._id = val
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

/**
 * Processor context object.
 *
 * Context objects are reponsible for propagating input values and previous
 * execution outputs along the various stages of spec processing. They also
 * collect errors which occur during processing for retrievel later on.
 */
export class RootContext extends Context {
  constructor (id, { node, artifacts, callbacks }) {
    super(id)
    this._node = node
    this._artifacts = artifacts
    this._errors = new ProcessingErrors()
    this._callbacks = { ...DEFAULT_CALLBACKS, ...callbacks }
    this._outputs = {}
  }

  createGroupContext (id) {
    return new GroupContext(id, this)
  }
}
