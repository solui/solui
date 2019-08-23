const Ownable = artifacts.require('./Ownable.sol')

module.exports = async deployer => {
  await deployer.deploy(Ownable, '0x0000000000000000000000000000000000000000')
}
