The solUI _Repository_ is a smart contract which maps Dapp IPFS content hashes to
smart contract bytecode hashes. It is located on the Etherum mainnet at:

* https://etherscan.io/address/0xa9FdEAEC32304ee5280445E20b475546c0831bCB

To interact with the contract use the following Dapp:

* https://solui.dev/ui/QmPKot3PdLSvuF3Aa3roxRhSsJxbWWK5jdsAw1YYYr8KBQ

The low-level smart contract interface is defined here:

* https://github.com/solui/contracts/blob/master/contracts/IRepository.sol

_Note: the intention is for improvements to be rolled out to the contract over time as new requirements arise. Thus
the contract itself is upgradeable and utilises the [Proxy + Eternal storage](https://hiddentao.com/archives/2019/10/03/upgradeable-smart-contracts-with-eternal-storage)
pattern._

## How it works

When a solUI Dapp is [published to IPFS](../Publishing/Overview) its resulting unique identifier is a content-addressable hash. And a
Dapp specification itself contains the ABIs and bytecodes of all the contracts interacted with by the Dapp.

**This means we can perform a reverse lookup from contract to Dapp!**

For any contract address we can fetch its
on-chain bytecode, hash the result, and then query the Repository to see if there any Dapps which map to that hash!

For example, if we have a Dapp whose IPFS id is `X` and the Dapp contains 2 contracts `Y` and `Z`, then we would add
the following information to the on-chain Repository:

* `X` maps to `[ keccak256(bytecodeOf(Y)), keccak256(bytecodeOf(Z)) ]`
* `keccak256(bytecodeOf(Y))` maps to `X`
* `keccak256(bytecodeOf(Z))` maps to `X`

Now any app or service can query the Repository with the a hash (of contract bytecode) to see if there is a Dapp which
talks to instances of that contract. And since the Dapp id is an IFPS id we can be confident that its still the exact
same code that the Dapp author originally deployed for that contract.

## Trusted publishers

Since anyone can publish a Dapp for any contract it would be useful to know who published a given Dapp in case we are
only interested in Dapps published by people we _trust_.

With this in mind the Repository additionally records who publishes a given Dapp ([Solidity: msg.sender](https://solidity.readthedocs.io/en/v0.6.4/units-and-global-variables.html)).

This then allows us to easily query _"the latest Dapp for contract X by publisher Y_". Additionally we can also query for
each and every Dapp by a given publisher.

