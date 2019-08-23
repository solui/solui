pragma solidity >=0.5.8;


contract Ownable {
  address payable public owner;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account unless `_owner` is provided.
   */
  constructor(address payable _owner) public {
    if (_owner != address(0)) {
      owner = _owner;
    } else {
      owner = msg.sender;
    }
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   */
  function transferOwnership(address payable _newOwner) public {
    require(_newOwner != owner, 'cannot transfer to oneself');
    owner = _newOwner;
  }
}
