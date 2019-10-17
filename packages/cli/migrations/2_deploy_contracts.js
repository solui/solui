const Ownable = artifacts.require('./basic/Ownable.sol')
const ERC20 = artifacts.require('./erc20/ERC20.sol')

module.exports = async deployer => {
  await deployer.deploy(Ownable, '0x0000000000000000000000000000000000000001')
  await deployer.deploy(ERC20, 'Test', 'Test', 1)
}
