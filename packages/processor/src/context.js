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
  constructor(parentContext, id) {
    this._parentContext = parentContext

    if (!id && !parentContext) {
      throw new Error(`Context: either id or parentContext must be set`)
    } else {
      if (!id) {
        this._id = parentContext.id
      } else {
        this._id = parentContext ? `${parentContext.id}.${id}` : id
      }
    }

    ;[
      'inputs',
      'artifacts',
      'errors',
      'inputs',
      'outputs',
      'callbacks',
      'network',
      'constants',
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

  recordError (msg) {
    this.errors().add(this.id, msg)
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
  constructor (id, { network = {}, artifacts, callbacks }) {
    super(null, id)
    this._network = network
    this._artifacts = artifacts
    this._errors = new ProcessingErrors()
    this._callbacks = { ...DEFAULT_CALLBACKS, ...callbacks }
    this._outputs = new Map()
    this._constants = new Map()
  }
}


class PanelContext extends Context {
  constructor(parentContext, id) {
    super(parentContext, id)
    this._inputs = new Map()
  }
}


class ArrayItemContext extends Context {
  constructor(parentContext, itemIndex) {
    super(parentContext, null)
    this.itemNum = parseInt(itemIndex, 10) + 1
  }

  recordError(msg) {
    super.recordError(`item ${this.itemNum}: ${msg}`)
  }
}


export const createChildContextFrom = (ctx, id) => {
  return new Context(ctx, id)
}


export const createPanelContextFrom = (ctx, id) => {
  return new PanelContext(ctx, id)
}


export const createArrayItemContextFrom = (ctx, id) => {
  return new ArrayItemContext(ctx, id)
}