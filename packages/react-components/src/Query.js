/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { Query as ApolloQuery } from 'react-apollo'
import { stringifyGraphqlError } from '@solui/graphql'

import ErrorBox from './ErrorBox'
import LoadingIcon from './LoadingIcon'

export const DEFAULT_IS_LOADING = ({ loading }) => loading
export const DEFAULT_RENDER_ERROR = ({ error }) => {
  let errStr = stringifyGraphqlError(error)

  const errStrLowercase = errStr.toLowerCase()

  if (errStrLowercase.includes('failed to fetch')) {
    errStr =
      'We were unable to connect to our backend server. Is your internet connection working?'
  }

  return <ErrorBox error={errStr} />
}
export const DEFAULT_RENDER_LOADING = () => <LoadingIcon />

const Query = props => {
  const {
    children,
    isLoading = DEFAULT_IS_LOADING,
    renderError = DEFAULT_RENDER_ERROR,
    renderLoading = DEFAULT_RENDER_LOADING,
    skipErrorHandler = false,
    skipLoadingHandler = false,
    ...otherProps
  } = props

  return (
    <ApolloQuery {...otherProps}>
      {result => {
        if (!skipLoadingHandler && isLoading(result)) {
          return renderLoading(result)
        }

        const { error } = result
        if (!skipErrorHandler && error) {
          return renderError(result)
        }

        return children(result)
      }}
    </ApolloQuery>
  )
}

export default Query
