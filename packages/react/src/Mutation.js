/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment } from 'react'
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { Mutation as ApolloMutation } from 'react-apollo'

import { DEFAULT_RENDER_ERROR } from './Query'

export { DEFAULT_RENDER_ERROR }

/**
 * Render a GraphQL mutation.
 * @param {Object} props Mutation configuration.
 * @return {ReactElement}
 */
const Mutation = props => {
  const {
    children,
    renderError = DEFAULT_RENDER_ERROR,
    ...otherProps
  } = props

  return (
    <ApolloMutation {...otherProps}>
      {(mutate, result) => {
        let content = children(mutate, result)

        const { error } = result
        if (error) {
          content = (
            <Fragment>
              {content}
              {renderError(result)}
            </Fragment>
          )
        }

        return content
      }}
    </ApolloMutation>
  )
}

export default Mutation
