import _ from '../utils/lodash'

const validateContract = (ctx, config) => {
  // check contract
  const contractId = _.get(config, 'contract')

  if (!contractId) {
    ctx.errors.push(`Exec ${ctx.id} must have a contract`)
  } else if (ctx.artifacts && !ctx.artifacts[contractId]) {
    ctx.errors.push(`Exec ${ctx.id} must have a contract present in the artifacts list`)
  }
}

const validateContractMethod = (ctx, config) => {
  const contractId = _.get(config, 'contract')
  const method = _.get(config, 'method')

  if (!method) {
    ctx.errors.push(`Exec ${ctx.id} must have a method`)
  } else {
    if (ctx.artifacts) {
      const matchingMethod = _.get(ctx.artifacts[contractId], `abi`, []).find(def => (
        def.name === method
      ))

      if (_.get(matchingMethod, 'type') !== 'function') {
        ctx.errors.push(`Exec ${ctx.id} must specify a valid contract method`)
      }
    }
  }
}

const EXECS = {
  deploy: {
    process: async (ctx, config) => {
      validateContract(ctx, config)

      const contractId = _.get(config, 'contract')
      const { bytecode } = ctx.artifacts[contractId]

      if (!bytecode) {
        ctx.errors.push(`Exec ${ctx.id} is a deployment but artifact is missing contract bytecode`)
      } else {
        const result = await ctx.process.deployContract(ctx.id, bytecode)
        // further execs may need this output as input!
        if (config.saveAsInput) {
          ctx.inputs[config.saveAsInput] = result
        }
      }
    }
  },
  call: {
    process: async (ctx, config) => {
      validateContract(ctx, config)
      validateContractMethod(ctx, config)
      // TODO: method call
    }
  },
  transaction: {
    process: async (ctx, config) => {
      validateContract(ctx, config)
      validateContractMethod(ctx, config)
      // TODO: transaction
    }
  },
}

export const process = async (ctx, execs) => {
  let i = 0

  while (execs.length > i) {
    const newCtx = { ...ctx, id: `${ctx.parentId}.${i}` }

    const execConfig = execs[i]

    // check execution step type
    const type = _.get(execConfig, 'type')

    if (!EXECS[type]) {
      ctx.errors.push(`Exec ${newCtx.id} must have a valid type: ${Object.keys(EXECS).join(', ')}`)
    } else {
      // check parameter mappings
      _.each(_.get(execConfig, 'parameters', {}), (inputId, paramId) => {
        if (!_.get(ctx, `inputs.${inputId}`)) {
          ctx.errors.push(`Exec ${newCtx.id} parameter ${paramId} maps from an invalid input: ${inputId}`)
        }
      })

      // eslint-disable-next-line no-await-in-loop
      await EXECS[type].process(newCtx, execConfig)
    }

    i += 1
  }
}
