import React from 'react'
import styled from '@emotion/styled'
import {
  ErrorBox,
} from '@solui/react-components'

import Layout from '../frontend/components/Layout'

const Heading = styled.h1`
  ${({ theme }) => theme.font('header', 'bold')}
  margin: 2rem 0;
  font-size: 2rem;
  color: #333;
`

const StatusCode = styled.p`
  ${({ theme }) => theme.font('body', 'bold')}
  margin: 0 0 1rem;
  font-size: 1.trem;
`

const StyledErrorBox = styled(ErrorBox)`
  margin: 0 0 1rem;
  font-size: 1.5rem;
`

const ErrorStack = styled.pre`
  ${({ theme }) => theme.font('body')}
  font-size: 0.8rem;
  line-height: 1.2em;
  background-color: #eee;
  border-radius: 5px;
  padding: 1em;
  margin: 0 0 1rem;
`

const Explanation = styled.p`
  ${({ theme }) => theme.font('body')}
  font-size: 1rem;
  color: #333;
  margin: 1rem 0 0;
  a {
    margin: 0 0.5em;
  }
`

export default class ErrorPage extends React.Component {
  static async getInitialProps ({ res, err, query: { msg, stack } = {} }) {
    /* eslint-disable-next-line no-nested-ternary */
    const statusCode = (res ? res.statusCode : (err ? err.statusCode : null))

    return { statusCode, msg, stack: res && res.inDevMode ? stack : null }
  }

  render () {
    const { msg, stack, statusCode } = this.props

    return (
      <Layout>
        <Heading>Sorry, we've encountered a problem 😕</Heading>
        {statusCode ? <StatusCode>Status: {statusCode}</StatusCode> : null}
        {msg ? <StyledErrorBox>{msg}</StyledErrorBox> : null}
        {stack ? <ErrorStack>{stack}</ErrorStack> : null}
        <Explanation>
          If you keep seeing this
          error please get in touch with us at
          <a href="mailto:hello@solui.dev">hello@solui.dev</a>
        </Explanation>
      </Layout>
    )
  }
}
