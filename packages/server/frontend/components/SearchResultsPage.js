/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import {
  ErrorBox,
  LoadingIcon,
} from '@solui/react-components'

import { Link, PkgVersionLink } from './Link'
import SearchResult from './SearchResult'

const Container = styled.div`
`

const List = styled.ul`
  ${flex({ align: 'stretch', justify: 'flex-start' })};
`

const ListItem = styled.li`
  display: block;
  padding: 0.7em;
  font-size: 1rem;

  &:nth-of-type(even) {
    background-color: ${({ theme }) => theme.searchResultsPageEvenItemBgColor};
  }

  &:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.searchResultsPageOddItemBgColor};
  }

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.searchResultsPageItemHoverBgColor}
  }
`

const MetaListItem = styled(ListItem)`
  ${({ theme }) => theme.font('body', 'regular', 'italic')};
  color: ${({ theme }) => theme.searchResultsMetaTextColor};
`

const NavListItem = styled.li`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'center' })}
  font-size: 0.8rem;
  padding: 0.7rem;
`

export default ({ className, searching, keyword, results }) => {
  let resultRender

  if (!searching) {
    if (results.error) {
      resultRender = <ErrorBox error={results.error} />
    } else {
      if (results.packages.length) {
        resultRender = (
          <>
            <List>
              {results.packages.map(r => (
                <PkgVersionLink key={r.name} pkg={r.name} vid={r.version.id}>
                  <ListItem>
                    <SearchResult pkg={r} />
                  </ListItem>
                </PkgVersionLink>
              ))}
            </List>
            <NavListItem>
              {(results.page > 1) ? (
                <Link page='search' query={{ keyword, page: results.page - 1 }}><div>Previous page</div></Link>
              ) : null}
              {(results.page < results.numPages) ? (
                <Link page='search' query={{ keyword, page: results.page + 1 }}><div>Next page</div></Link>
              ) : null}
            </NavListItem>
          </>
        )
      } else {
        resultRender = (
          <List>
            <MetaListItem>No results found :/</MetaListItem>
          </List>
        )
      }
    }
  }

  return (
    <Container className={className}>
      {searching ? <LoadingIcon /> : null}
      {resultRender}
    </Container>
  )
}
