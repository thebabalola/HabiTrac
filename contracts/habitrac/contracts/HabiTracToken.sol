// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HabiTracToken is ERC20, ERC20Burnable, Ownable {
    mapping(address => bool) public minters;

    constructor(address initialOwner) ERC20("HabiTrac Token", "HABIT") Ownable(initialOwner) {
        // Initial supply can be minted by owner as needed
    }

    function mint(address to, uint256 amount) public {
        require(owner() == msg.sender || minters[msg.sender], "Not authorized to mint");
        _mint(to, amount);
    }

    function setMinter(address minter, bool enabled) public onlyOwner {
        minters[minter] = enabled;
    }
}

