/**
 * Render an Ethereum address.
 * @return {ReactElement}
 */
const Address = ({ address, tx, children }) => {
  if (address) {
    return <a href={`https://etherscan.io/address/${address}`}>{children || address}</a>
  } else if (tx) {
    return <a href={`https://etherscan.io/tx/${tx}`}>{children || tx}</a>
  } else {
    return null
  }
}

export default Address
