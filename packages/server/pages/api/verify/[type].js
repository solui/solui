import { _ } from '@solui/utils'

import { doBootstrap } from '../../../src'
import { middleware as ErrorWrapper } from '../../../src/error'

const { log, notifier } = doBootstrap()

const endpoint = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      await notifier.handleLink({ req, res })
      break
    }
    default: {
      res.status(400)
      res.send('Bad request')
    }
  }
}

export default _.compose(ErrorWrapper({ log }))(endpoint)
