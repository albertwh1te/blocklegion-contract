// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IBlockSoldier is IERC721Enumerable {
    function get_solider_level(
        uint _solider
    ) external view returns (uint current_level);

    function class(uint) external view returns (uint);

    function name(uint) external view returns (string memory);

    function task(uint) external view returns (uint);

    function captive(address _winner, address _loser, uint _id) external;

}
