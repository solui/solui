import React from 'react'

import { getInitialPageProps } from '../frontend/ssr'
import PageWrapper from '../frontend/components/PageWrapper'

const HomePage = props => {
  return (
    <PageWrapper {...props}>
      Homepage!
    </PageWrapper>
  )
}

HomePage.getInitialProps = getInitialPageProps

export default HomePage
