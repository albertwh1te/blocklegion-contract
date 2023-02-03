// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IBattleSystem {

    function getSoldierAttackPower(
        uint _soliderId
    ) external view returns (uint attackPower);

    function getSoldierDefensePower(
        uint _soliderId
    ) external view returns (uint defensePower);
}
