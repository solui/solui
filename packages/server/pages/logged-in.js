import React from 'react'

import { getInitialPageProps } from '../frontend/ssr'
import PageWrapper from '../frontend/components/PageWrapper'

const LoggedInPage = props => {
  return (
    <PageWrapper {...props}>
      <p>Congrats, you are now logged in!</p>
      <p>You may close this browser tab.</p>
    </PageWrapper>
  )
}

LoggedInPage.getInitialProps = getInitialPageProps

export default LoggedInPage
