import React, { useState, useEffect, useRef } from 'react'
import { useRect } from '@reach/rect'
import styled from '@emotion/styled'
import { withApollo } from 'react-apollo'
import { SearchQuery } from '@solui/graphql'
import Router from 'next/router'

import {
  Layout,
} from '@solui/react-components'

import Header from './Header'
import SearchResultsBox from './SearchResultsBox'

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1;
`

const Content = styled.div`
  width: 100%;
  margin-top: 100px;
`

const StyledSearchResultsBox = styled(SearchResultsBox)`
  position: fixed;
  z-index: 2;
  top: ${({ rect }) => rect.top + 50}px;
  left: ${({ rect }) => rect.left}px;
  width: ${({ rect }) => rect.width}px;
  height: auto;
`

let searchQueryTimer

const PageLayout = ({ client, children }) => {
  const [ results, setResults ] = useState(null)
  const [ searching, setSearching ] = useState(false)
  const [ searchText, setSearchText ] = useState('')
  const [ page ] = useState(1)
  const searchInputRef = useRef(null)
  const searchInputRect = useRect(searchInputRef)

  useEffect(() => {
    clearTimeout(searchQueryTimer)

    searchQueryTimer = setTimeout(async () => {
      setResults(null)

      if (!searchText) {
        return
      }

      setSearching(true)

      try {
        const { data: { search } } = await client.safeQuery({
          query: SearchQuery,
          fetchPolicy: 'network-only',
          variables: {
            criteria: {
              keyword: searchText,
              page,
            }
          }
        })

        setResults(search)
      } catch (err) {
        setResults({ error: err })
      } finally {
        setSearching(false)
      }
    }, 250 /* wait for user to stop typing */)
  }, [ client, searchText, page ])

  // hide popup when page changes
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setResults(null))
  }, [/*  run once  */])

  return (
    <Layout>
      <StyledHeader
        ref={searchInputRef}
        searchText={searchText}
        onSearchTextChange={setSearchText}
      />
      {(searching || results) ? (
        <StyledSearchResultsBox
          rect={searchInputRect}
          searching={searching}
          results={results}
          keyword={searchText}
        />
      ) : null}
      <Content>
        {children}
      </Content>
    </Layout>
  )
}

export default withApollo(PageLayout)
