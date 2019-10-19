import React from 'react'
import styled from '@emotion/styled'
import { SearchQuery } from '@solui/graphql'
import { useRouter } from 'next/router'
import {
  Query,
} from '@solui/react-components'

import { getInitialPageProps } from '../frontend/ssr'
import PageWrapper from '../frontend/components/PageWrapper'
import SearchResultsPage from '../frontend/components/SearchResultsPage'

const StyledSearchResultsPage = styled(SearchResultsPage)`
  margin: 2rem auto 0;
  width: 80%;
`

const SearchPage = props => {
  const router = useRouter()
  const { keyword, page = 1 } = router.query

  return (
    <PageWrapper {...props}>
      <h1>Search for "{keyword}" ...</h1>
      <Query
        query={SearchQuery}
        variables={{
          criteria: {
            keyword,
            page: parseInt(page, 10),
          }
        }}
        fetch-policy='cache-and-network'
      >
        {({ loading, data: { search } }) => (
          <StyledSearchResultsPage
            searching={loading}
            results={search}
            keyword={keyword}
          />
        )}
      </Query>
    </PageWrapper>
  )
}

SearchPage.getInitialProps = getInitialPageProps

export default SearchPage
