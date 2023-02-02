// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./base64.sol";

contract BlockSolider is ERC721Enumerable, Ownable, ReentrancyGuard {
    /***********
     * LIBRARY *
     ***********/

    using SafeMath for uint;

    /**************************
     * PUBLIC GLOBAL VARIABLE *
     **************************/

    enum TASK {
        DEDEND,
        ATTACK
    }

    uint public next_solider;

    uint public constant FREE_RECRUIT_LIMIT = 2;
    uint public constant RECRUIT_PRICE = 0.005 ether;

    mapping(uint => uint) public level;
    mapping(uint => string) public name;
    mapping(uint => uint) public task;
    mapping(address => uint) public freemint;

    /*********
     * EVENT *
     *********/

    event Recruit(address indexed owner, uint soliderId);

    constructor() ERC721("BlockSolider", "BS") {}

    function _recruit() private {
        uint _next_solider = next_solider;
        level[_next_solider] = 1;
        name[_next_solider] = string.concat(
            "Solider #",
            Strings.toString(_next_solider)
        );
        task[_next_solider] = uint(TASK.ATTACK);
        _safeMint(msg.sender, _next_solider);
        emit Recruit(msg.sender, _next_solider);
        next_solider = next_solider.add(1);
    }

    /*********************
     * EXTERNAL FUNCTION *
     *********************/

    function free_recruit() external nonReentrant {
        require(
            freemint[msg.sender] < FREE_RECRUIT_LIMIT,
            "FREE_RECRUIT_LIMIT reached !"
        );
        freemint[msg.sender] = freemint[msg.sender].add(2);
        _recruit();
        _recruit();
    }

    function recruit(uint recruit_number) external payable nonReentrant {
        require(
            msg.value == RECRUIT_PRICE.mul(recruit_number),
            "wrong msg.value for mint"
        );
        for (uint i = 0; i < recruit_number; i++) {
            _recruit();
        }
    }

    /********************
     * TOKENURI AND SVG *
     ********************/

    // function tokenURI(
    //     uint256 _solider 
    // ) public view override returns (string memory) {
    //     string memory output = drawSvg(_summoner);
    //     string memory attribute = getAttribute(_summoner);
    //     string memory json = Base64.encode(
    //         bytes(
    //             string.concat(
    //                     '{"name": name[_solider],
    //                     '",',
    //                     attribute,
    //                     ', "description": "BlockSolider is a fully on-chain MMORPG, with all game logic and resources stored on the blockchain.", "image": "data:image/svg+xml;base64,',
    //                     Base64.encode(bytes(output)),
    //                     '"}'
    //                 )
    //             )
    //         )
    //     );
    //     output = string(
    //         abi.encodePacked("data:application/json;base64,", json)
    //     );

    //     return output;
    // }

    // function getAttribute(
    //     uint256 _summoner
    // ) public view returns (string memory attribute) {
    //     string memory classAttr = string(
    //         abi.encodePacked(
    //             '{"trait_type": "Class","value":"',
    //             classes(class[_summoner]),
    //             '"},'
    //         )
    //     );
    //     string memory levelAttr = string(
    //         abi.encodePacked(
    //             '{"trait_type": "Level","value":',
    //             toString(level[_summoner]),
    //             "},"
    //         )
    //     );

    //     string memory fractAttr = string(
    //         abi.encodePacked(
    //             '{"trait_type": "Fraction","value":"',
    //             factions(faction[_summoner]),
    //             '"},'
    //         )
    //     );

    //     string memory rarityAttr = string(
    //         abi.encodePacked(
    //             '{"trait_type": "Rarity","value":"',
    //             rarities(rarity[_summoner]),
    //             '"}'
    //         )
    //     );

    //     attribute = string(
    //         abi.encodePacked(
    //             '"attributes":[',
    //             classAttr,
    //             fractAttr,
    //             levelAttr,
    //             rarityAttr,
    //             "]"
    //         )
    //     );
    // }

    // function getSVGContent(
    //     uint256 _summoner
    // ) public view returns (string memory content) {
    //     string memory classStr = string(
    //         abi.encodePacked("Class", " ", classes(class[_summoner]))
    //     );

    //     string memory factionStr = string(
    //         abi.encodePacked("Faction", " ", factions(faction[_summoner]))
    //     );

    //     string memory levelStr = string(
    //         abi.encodePacked("Level", " ", toString(level[_summoner]))
    //     );

    //     string memory rarityStr = string(
    //         abi.encodePacked("Rarity", " ", rarities(rarity[_summoner]))
    //     );

    //     content = string(
    //         abi.encodePacked(
    //             classStr,
    //             '</text><text x="10" y="40" class="base">',
    //             factionStr,
    //             '</text><text x="10" y="60" class="base">',
    //             levelStr,
    //             '</text><text x="10" y="80" class="base">',
    //             rarityStr
    //         )
    //     );
    // }

    // function drawSvg(
    //     uint256 _summoner
    // ) public view returns (string memory output) {
    //     string
    //         memory head = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

    //     string memory content = getSVGContent(_summoner);
    //     string memory tail = "</text></svg>";

    //     output = string(abi.encodePacked(head, content, tail));
    // }
}
