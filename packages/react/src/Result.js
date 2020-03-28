/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Fragment } from 'react'
import styled from '@emotion/styled'

import AlertBox from './AlertBox'
import ErrorBox from './ErrorBox'
import Value from './Value'


const Container = styled.div`
  margin-bottom: 0.5rem;
`

const Results = styled.ul`
  list-style: none;
  display: block;
  padding: 1rem;
  background-color: ${({ theme }) => theme.resultBgColor};
  margin-bottom: 0.2rem;
`

const ResultItem = styled.li`
  margin-bottom: ${({ moreThanOne }) => (moreThanOne ? '2rem' : '0')};
  &:last-child {
    margin-bottom: 0;
  }
`

const StyledErrorBox = styled(ErrorBox)`
  margin-bottom: 0.2rem;
`

const StyledAlertBox = styled(AlertBox)`
  margin-bottom: 0.2rem;
`

const Title = styled.h3`
  margin: 0 0 1em;
  font-size: 1.2em;
`

/**
 * Render one ore more execution results.
 *
 * @see {Value}
 * @return {ReactElement}
 */
const Result = ({ className, result: { value, error, meta: { successMsgs, failureMsgs } } }) => {
  let content

  if (error) {
    content = (
      <Fragment>
        <StyledErrorBox error={error} />
        {failureMsgs.map(msg => (
          <StyledErrorBox key={msg} error={msg} />
        ))}
      </Fragment>
    )
  } else {
    let resultItems = []

    const sanitizedValue = (value || new Map())

    sanitizedValue.forEach((v, k) => {
      const { title, result, resultTransformed, ...valueProps } = v

      resultItems.push(
        <ResultItem key={k} moreThanOne={!!sanitizedValue.size}>
          <Title>{title}</Title>
          <Value {...valueProps} value={result} valueTransformed={resultTransformed} />
        </ResultItem>
      )
    })

    if (!resultItems.length) {
      resultItems = <ResultItem>Success!</ResultItem>
    }

    content = (
      <Fragment>
        <Results>
          {resultItems}
        </Results>
        {successMsgs.map(msg => (
          <StyledAlertBox key={msg} msg={msg} />
        ))}
      </Fragment>
    )
  }

  return (
    <Container className={className}>
      {content}
    </Container>
  )
}

export default Result
