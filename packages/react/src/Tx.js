/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'
import styled from '@emotion/styled'

import Value from './Value'

const Container = styled.div`
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: ${({ theme }) => theme.txBgColor};
  color: ${({ theme }) => theme.txTextColor};
  font-size: 0.8rem;
  word-break: break-all;
`

const Title = styled.span`
  margin: 0 0.3em 0 0;
  font-size: 110%;
  ${({ theme }) => theme.font('body', 'bold')};
`

/**
 * Render transaction info.
 *
 * @return {ReactElement}
 */
const Tx = ({ className, tx: { hash } }) => {
  return (
    <Container className={className}>
      <Title title="Transaction hash">Tx:</Title>
      <Value type='txHash' value={hash} />
    </Container>
  )
}

export default Tx
