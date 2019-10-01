/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'
import { flex } from '@solui/styles'
import {
  DateTime,
} from '@solui/react-components'

const Container = styled.div`
  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
`

const Info = styled.section`
  ${flex({ justify: 'center', align: 'flex-start' })};
`

const Meta = styled.section`
  ${flex({ justify: 'center', align: 'flex-end' })};
`

const Title = styled.p`
  ${({ theme }) => theme.font('body', 'bold')};
  color: ${({ theme }) => theme.searchResultTitleTextColor};
  font-size: 1em;
  margin-bottom: 0.5em;
  font-size: 120%;
`

const Summary = styled.p`
  ${({ theme }) => theme.font('body', 'regular')};
  color: ${({ theme }) => theme.searchResultSummaryTextColor};
  font-size: 0.8em;
`

const MetaDiv = styled.div`
  color: ${({ theme }) => theme.searchResultMetaTextColor};
  font-size: 0.7em;
  margin-bottom: 0.4em;

  &:last-child {
    margin-bottom: 0;
  }
`

const Published = styled(DateTime)`
  ${({ theme }) => theme.font('body', 'regular')};
`

const VersionId = styled.span`
  ${({ theme }) => theme.font('body', 'regular')};
`

export default ({ className, pkg }) => {
  return (
    <Container className={className}>
      <Info>
        <Title>{pkg.name}</Title>
        <Summary>{pkg.version.title}</Summary>
      </Info>
      <Meta>
        <MetaDiv>
          <VersionId>{pkg.version.id}</VersionId>
        </MetaDiv>
        <MetaDiv>
          <Published dateTime={pkg.version.created} />
        </MetaDiv>
      </Meta>
    </Container>
  )
}
