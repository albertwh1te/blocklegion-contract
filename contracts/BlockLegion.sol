// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interface/IBlockSoldier.sol";
import "./interface/IBattleSystem.sol";
import "./BlockSoldier.sol";

contract BlockLegion is Ownable {
    /***********
     * LIBRARY *
     ***********/

    using SafeMath for uint;

    /**************************
     * PUBLIC GLOBAL VARIABLE *
     **************************/

    mapping(address => string) public legionName;
    mapping(address => uint) public nextAttackTime;
    mapping(address => uint) public nextDefendTime;
    IBlockSoldier public soldier;
    IBattleSystem public battleSystem;

    /*********
     * EVENT *
     *********/

    event WarOutcome(
        address indexed attacker,
        address indexed defender,
        string attakcerName,
        string defenderName,
        uint outcome,
        uint captive_id,
        uint time
    );

    constructor(address _soldier) {
        soldier = IBlockSoldier(_soldier);
    }

    /*********************
     * EXTERNAL FUNCTION *
     *********************/

    function getLegionSoldiers(
        address _user
    ) external view returns (uint[] memory infos) {
        uint totalySoldier = soldier.balanceOf(_user);
        infos = new uint[](totalySoldier.mul(4));
        for (uint i = 0; i < totalySoldier.mul(4); i += 4) {
            uint soliderId = soldier.tokenOfOwnerByIndex(_user, i.div(4));
            infos[i] = soliderId;
            infos[i + 1] = soldier.task(soliderId);
            infos[i + 2] = battleSystem.getSoldierAttackPower(soliderId);
            infos[i + 3] = battleSystem.getSoldierDefensePower(soliderId);
        }
    }

    function setBattleSystem(address _battleSystem) external onlyOwner {
        battleSystem = IBattleSystem(_battleSystem);
    }

    function setLegionName(string memory _name) external {
        require(bytes(_name).length <= 20, "Name too long");
        require(bytes(_name).length > 0, "Name too short");
        legionName[msg.sender] = _name;
    }

    function getAttackPower(
        address _address
    ) public view returns (uint attackPower) {
        uint soldierNumber = soldier.balanceOf(_address);
        attackPower = 0;
        for (uint i = 0; i < soldierNumber; i++) {
            uint soliderId = soldier.tokenOfOwnerByIndex(_address, i);
            if (soldier.task(soliderId) == uint(BlockSoldier.TASK.ATTACK)) {
                attackPower = attackPower.add(
                    battleSystem.getSoldierAttackPower(soliderId)
                );
            }
        }
    }

    function getDefensePower(
        address _address
    ) public view returns (uint defensePower) {
        uint soldierNumber = soldier.balanceOf(_address);
        defensePower = 0;
        for (uint i = 0; i < soldierNumber; i++) {
            uint soliderId = soldier.tokenOfOwnerByIndex(_address, i);
            if (soldier.task(soliderId) == uint(BlockSoldier.TASK.DEDEND)) {
                defensePower = defensePower.add(
                    battleSystem.getSoldierDefensePower(soliderId)
                );
            }
        }
    }

    function war(address defender) external returns (uint, uint) {
        address attacker = msg.sender;
        require(attacker != defender, "Can't attack yourself");
        require(soldier.balanceOf(attacker) > 0, "No soldier");
        require(soldier.balanceOf(defender) > 0, "No soldier");
        require(nextAttackTime[attacker] <= block.timestamp, "Attack too fast");
        require(nextDefendTime[defender] <= block.timestamp, "Still in Shield");

        if (getAttackPower(attacker) > getDefensePower(defender)) {
            uint index = soldier.balanceOf(defender).sub(1);

            uint soldier_index = soldier.tokenOfOwnerByIndex(defender, index);

            soldier.captive(attacker, defender, soldier_index);

            nextAttackTime[attacker] = block.timestamp.add(5 minutes);

            nextDefendTime[defender] = block.timestamp.add(30 minutes);

            emit WarOutcome(
                attacker,
                defender,
                legionName[attacker],
                legionName[defender],
                0,
                soldier_index,
                block.timestamp
            );

            return (0, soldier_index);
        } else if (getAttackPower(attacker) < getDefensePower(defender)) {
            nextDefendTime[defender] = block.timestamp.add(30 minutes);

            emit WarOutcome(
                attacker,
                defender,
                legionName[attacker],
                legionName[defender],
                1,
                0,
                block.timestamp
            );

            return (1, 0);
        } else {
            emit WarOutcome(
                attacker,
                defender,
                legionName[attacker],
                legionName[defender],
                2,
                0,
                block.timestamp
            );

            return (2, 0);
        }
    }
}
