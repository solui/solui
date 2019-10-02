/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import {
  ErrorBox,
} from '@solui/react-components'

import SearchResult from './SearchResult'
import { Link, PkgVersionLink } from './Link'

const Container = styled.div``

const List = styled.ul`
  ${flex({ align: 'stretch', justify: 'flex-start' })};
`

const ListItem = styled.li`
  display: block;
  border-collapse: collapse;
  border-bottom: 1px solid ${({ theme }) => theme.searchResultsPopupItemBorderColor};
  padding: 0.7em;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.searchResultsPopupItemHoverBgColor}
  }
`

const MetaListItem = styled(ListItem)`
  ${({ theme }) => theme.font('body', 'regular', 'italic')};
  color: ${({ theme }) => theme.searchResultsMetaTextColor};
`

export default ({ className, results, keyword }) => {
  let resultRender

  if (results.error) {
    resultRender = <ErrorBox error={results.error} />
  } else {
    if (results.packages.length) {
      resultRender = (
        <List>
          {results.packages.map(r => (
            <PkgVersionLink key={r.name} pkg={r.name} vid={r.version.id}>
              <ListItem>
                <SearchResult pkg={r} />
              </ListItem>
            </PkgVersionLink>
          ))}
          {(results.totalResults > results.packages.length) ? (
            <Link key="more" page='search' query={{ keyword }}>
              <MetaListItem>
                See all results...
              </MetaListItem>
            </Link>
          ) : null}
        </List>
      )
    } else {
      resultRender = (
        <List>
          <MetaListItem>No results found :/</MetaListItem>
        </List>
      )
    }
  }

  return (
    <Container className={className}>
      {resultRender}
    </Container>
  )
}
