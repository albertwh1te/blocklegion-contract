// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interface/IBattleSystem.sol";
import "./interface/IBlockSoldier.sol";

import "./BlockSoldier.sol";

contract BattleSystem is IBattleSystem {
    /***********
     * LIBRARY *
     ***********/

    using SafeMath for uint;

    /**************************
     * PUBLIC GLOBAL VARIABLE *
     **************************/

    IBlockSoldier public soldier;

    constructor(address _soldier) {
        soldier = IBlockSoldier(_soldier);
    }

    /*********************
     * EXTERNAL FUNCTION *
     *********************/

    function getSoldierAttackPower(
        uint _soliderId
    ) public view returns (uint attackPower) {
        attackPower =
            soldier.get_solider_level(_soliderId).add(1) *
            uint(3).sub(soldier.class(_soliderId));
    }

    function getSoldierDefensePower(
        uint _soliderId
    ) public view returns (uint defensePower) {
        defensePower =
            soldier.get_solider_level(_soliderId).add(1) *
            soldier.class(_soliderId).add(1);
    }
}
