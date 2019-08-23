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
  _contract: {
    validate: (ctx, config) => {
      const errors = []

      // check contract
      if (!_.get(config, 'contract')) {
        errors.push(`Execution step ${ctx.id} must have a contract`)
      } else if (ctx.artifacts && !ctx.artifacts[config.contract]) {
        errors.push(`Execution step ${ctx.id} must have a valid contract`)
      }

      return errors
    },
  },
  _contractMethod: {
    validate: (ctx, config) => {
      const errors = []

      if (!_.get(config, 'method')) {
        errors.push(`Execution step ${ctx.id} must have a method`)
      } else {
        if (ctx.artifacts) {
          const matchingMethod = _.get(ctx.artifacts[config.contract], `abi`, []).find(def => (
            def.name === config.method
          ))

          if (_.get(matchingMethod, 'type') !== 'function') {
            errors.push(`Execution step ${ctx.id} must specify a valid contract method`)
          }
        }
      }

      return errors
    },
  },
  deploy: {
    validate: (ctx, config) => EXECS._contract.validate(ctx, config),
  },
  call: {
    validate: (ctx, config) => [
      ...EXECS._contract.validate(ctx, config),
      ...EXECS._contractMethod.validate(ctx, config),
    ],
  },
  transaction: {
    validate: (ctx, config) => [
      ...EXECS._contract.validate(ctx, config),
      ...EXECS._contractMethod.validate(ctx, config),
    ],
  },
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

    // check execution step type
    if (!EXECS[_.get(exConfig, 'type')]) {
      errors.push(`Execution step ${newCtx.id} must have a valid type: ${Object.keys(EXECS).join(', ')}`)
    } else {
      // check parameter mappings
      _.each(_.get(exConfig, 'parameters', {}), (inputId, paramId) => {
        if (!_.get(ctx, `ui.config.inputs.${inputId}`)) {
          errors.push(`Execution step ${newCtx.id} parameter ${paramId} maps from an invalid input id`)
        }
      })

      errors.push(...EXECS[exConfig.type].validate(newCtx, exConfig))
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

export const validate = ({ ui, artifacts }) => {
  const errors = []

  if (_.isEmpty(ui)) {
    errors.push('UI spec is empty.')
  } else {
    const ctx = { artifacts }

    _.each(ui, (config, id) => {
      errors.push(...validateUi(ctx, id, config))
    })
  }

  if (errors.length) {
    const e = new Error(`There were one or more validation errors. See details.`)
    e.details = errors
    throw e
  }
}
