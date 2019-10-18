/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import {
  TextInput,
} from '@solui/react-components'

import { Link } from './Link'

const Container = styled.header`
  background-color: ${({ theme }) => theme.headerBgColor};
  color: ${({ theme }) => theme.headerTextColor};
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
  padding: 0 1rem;
`

const Brand = styled.div`
  margin-right: 1rem;
  cursor: pointer;
`

const Search = styled.div`
  flex: 1;
`

const SearchInput = styled(TextInput)`
`

export default forwardRef(({ className, searchText, onSearchTextChange, onClickHome }, ref) => {
  return (
    <Container className={className}>
      <Link page=''>
        <Brand onClick={onClickHome}>solui</Brand>
      </Link>
      <Search>
        <SearchInput
          ref={ref}
          name='search'
          value={searchText}
          type='text'
          placeholder='Search by keyword or on-chain contract address'
          onChange={onSearchTextChange}
        />
      </Search>
    </Container>
  )
})
