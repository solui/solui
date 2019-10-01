import React, { useState, useCallback } from 'react'
import uuid from 'uuid/v4'
import styled from '@emotion/styled'
import { LoginMutation } from '@solui/graphql'
import { isEmail, getQueryString } from '@solui/utils'
import {
  Button,
  AlertBox,
  Mutation,
  TextInput,
} from '@solui/react-components'

import Layout from './_components/Layout'

const StyledAlert = styled(AlertBox)`
  margin: 1.5rem 0;
`

const StyledTextInput = styled(TextInput)`
  margin: 1.5rem 0;
  max-width: 500px;
`

const StyledButton = styled(Button)`
  margin-bottom: 1rem;
`

const LoginPage = () => {
  const [ sent, setSent ] = useState(false)
  const [ email, setEmail ] = useState('')
  const [ validationError, setValidationError ] = useState(null)

  const onChange = useCallback(v => {
    setEmail(v)
    setValidationError(isEmail(v) ? false : 'must be a valid email address')
  }, [ setEmail, setValidationError ])

  const onCompleted = useCallback(() => setSent(true), [ setSent ])

  const createSubmitHandler = useCallback(callback => e => {
    e.preventDefault()
    callback()
  }, [])

  return (
    <Layout>
      {sent ? (
        <StyledAlert msg={`We have sent an email to: ${email}. Please follow the link in this email to finish logging in.`} />
      ) : (
        <Mutation
          mutation={LoginMutation}
          variables={{
            email,
            loginToken: getQueryString('token') || uuid()
          }}
          onCompleted={onCompleted}
        >
          {(login, { loading }) => (
            <form onSubmit={validationError ? null : createSubmitHandler(login)}>
              <h1>Login</h1>
              <StyledTextInput
                name="email"
                onChange={onChange}
                value={email}
                error={validationError}
                title='Email'
                type='email'
              />
              <StyledButton
                loading={loading}
                disabled={false !== validationError}
                onClick={createSubmitHandler(login)}
              >
                Login
              </StyledButton>
            </form>
          )}
        </Mutation>
      )}
    </Layout>
  )
}

export default LoginPage
