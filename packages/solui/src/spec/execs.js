import _ from '../utils/lodash'

const validateContract = (ctx, config) => {
  // check contract
  if (!_.get(config, 'contract')) {
    ctx.errors.push(`Execution step ${ctx.id} must have a contract`)
  } else if (ctx.artifacts && !ctx.artifacts[config.contract]) {
    ctx.errors.push(`Execution step ${ctx.id} must have a valid contract`)
  }
}

const validateContractMethod = (ctx, config) => {
  if (!_.get(config, 'method')) {
    ctx.errors.push(`Execution step ${ctx.id} must have a method`)
  } else {
    if (ctx.artifacts) {
      const matchingMethod = _.get(ctx.artifacts[config.contract], `abi`, []).find(def => (
        def.name === config.method
      ))

      if (_.get(matchingMethod, 'type') !== 'function') {
        ctx.errors.push(`Execution step ${ctx.id} must specify a valid contract method`)
      }
    }
  }
}

const EXECS = {
  deploy: {
    parse: (ctx, config) => {
      validateContract(ctx, config)
      ctx.processor.doExecStep(config)
    }
  },
  call: {
    parse: (ctx, config) => {
      validateContract(ctx, config)
      validateContractMethod(ctx, config)
      ctx.processor.doExecStep(config)
    }
  },
  transaction: {
    parse: (ctx, config) => {
      validateContract(ctx, config)
      validateContractMethod(ctx, config)
      ctx.processor.doExecStep(config)
    }
  },
}

export const parse = (ctx, execs) => {
  // need atleast 1 execution step
  if (!_.get(execs, '0')) {
    ctx.errors.push(`${ctx.parentId} must have atleast 1 execution step`)
  } else {
    _.each(execs, (exConfig, exNum) => {
      const newCtx = { ...ctx, id: `${ctx.parentId}.${exNum}` }

      // check execution step type
      if (!EXECS[_.get(exConfig, 'type')]) {
        ctx.errors.push(`Execution step ${newCtx.id} must have a valid type: ${Object.keys(EXECS).join(', ')}`)
      } else {
        // check parameter mappings
        _.each(_.get(exConfig, 'parameters', {}), (inputId, paramId) => {
          if (!_.get(ctx, `panel.inputs.${inputId}`)) {
            ctx.errors.push(`Execution step ${newCtx.id} parameter ${paramId} maps from an invalid input: ${inputId}`)
          }
        })

        EXECS[exConfig.type].parse(newCtx, exConfig)
      }
    })
  }
}
