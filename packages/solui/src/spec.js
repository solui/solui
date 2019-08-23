import _ from 'lodash'

const INPUTS = {
  address: true,
  uint: true,
  int: true,
  bool: true,
  string: true,
  bytes32: true,
}

const EXECS = {
  deploy: true,
  call: true,
  transaction: true,
}

const validateInputs = (ctx, inputs) => {
  const errors = []

  // check inputs
  _.each(inputs, (inputConfig, inputId) => {
    const logPrefix = `${ctx.id}.${inputId}`

    if (!INPUTS[_.get(inputConfig, 'type')]) {
      errors.push(`Input ${logPrefix} must have a valid type: ${Object.keys(INPUTS).join(', ')}`)
    } else {
      // TODO: per-type validation
    }
  })

  return errors
}

const validateExecs = (ctx, execs) => {
  const errors = []

  // need atleast 1 execution step
  if (!_.get(execs, '0')) {
    errors.push(`${ctx.id} must have atleast 1 execution step`)
  }

  _.each(execs, (exConfig, exNum) => {
    const newCtx = { ...ctx, id: `${ctx.id}.${exNum}` }

    // check contract
    if (!_.get(exConfig, 'contract')) {
      errors.push(`Execution step ${newCtx.id} must have a contract`)
    }
    // check execution step type
    if (!EXECS[_.get(exConfig, 'type')]) {
      errors.push(`Execution step ${newCtx.id} must have a valid type: ${Object.keys(EXECS).join(', ')}`)
    } else {
      // check parameter mappings
      _.each(_.get(exConfig, 'parameters', {}), (inputId, paramId) => {
        if (!_.get(ctx, `ui.config.inputs.${inputId}`)) {
          errors.push(`${newCtx.id}.param.${paramId} maps from an invalid input id`)
        }
      })

      // todo: per-type validation
    }
  })

  return errors
}

const validateUi = (ctx, id, config) => {
  const errors = []

  // need title
  if (!_.get(config, 'title')) {
    errors.push(`${id} must have a title`)
  }

  ctx.ui = { id, config }
  ctx.id = id

  errors.push(...validateInputs(ctx, _.get(config, 'inputs', {})))
  errors.push(...validateExecs(ctx, _.get(config, 'execute', [])))

  return errors
}

export const validate = ui => {
  const errors = []

  if (_.isEmpty(ui)) {
    errors.push('UI spec is empty.')
  } else {
    _.each(ui, (config, id) => {
      errors.push(...validateUi({}, id, config))
    })
  }

  if (errors.length) {
    const e = new Error(`There were one or more validation errors. See details.`)
    e.details = errors
    throw e
  }
}
