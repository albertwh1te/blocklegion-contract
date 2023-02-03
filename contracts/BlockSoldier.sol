// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./base64.sol";

contract BlockSoldier is ERC721Enumerable, Ownable, ReentrancyGuard {
    /***********
     * LIBRARY *
     ***********/

    using SafeMath for uint;

    /********
     * ENUM *
     ********/

    enum TASK {
        DEDEND,
        ATTACK
    }

    enum SoldierClass {
        KNIGHT,
        INFANTRY,
        ARCHER
    }

    /**************************
     * PUBLIC GLOBAL VARIABLE *
     **************************/

    uint public next_solider;

    uint public constant FREE_RECRUIT_LIMIT = 2;
    uint public constant RECRUIT_PRICE = 0.005 ether;

    address public LEGION;

    mapping(uint => uint) public level;
    mapping(uint => string) public name;
    mapping(uint => TASK) public task;
    mapping(address => uint) public freemint;
    mapping(uint => uint) public birthblock;
    mapping(uint => SoldierClass) public class;

    /*********
     * EVENT *
     *********/

    event Recruit(address indexed owner, uint soliderId);

    constructor() ERC721("BlockSoldier", "BS") {}

    /********************
     * PRIVATE FUNCTION *
     ********************/

    function _recruit(uint _class) private {
        uint _next_solider = next_solider;

        level[_next_solider] = 0;

        name[_next_solider] = string.concat(
            "Solider #",
            Strings.toString(_next_solider)
        );

        task[_next_solider] = TASK.ATTACK;

        birthblock[_next_solider] = block.number;

        class[_next_solider] = SoldierClass(_class);

        _safeMint(msg.sender, _next_solider);
        emit Recruit(msg.sender, _next_solider);
        next_solider = next_solider.add(1);
    }

    /*******************
     * PUBLIC FUNCTION *
     *******************/

    function classes(
        SoldierClass _class
    ) public pure returns (string memory classStr) {
        if (_class == SoldierClass.ARCHER) {
            classStr = "Archer";
        }
        if (_class == SoldierClass.KNIGHT) {
            classStr = "Knight";
        }
        if (_class == SoldierClass.INFANTRY) {
            classStr = "Infantry";
        }
    }

    function sqrt(uint x) public pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    function get_solider_level(
        uint _solider
    ) public view returns (uint current_level) {
        uint xp = block.number.sub(birthblock[_solider]);

        current_level = sqrt(
            uint(175).div(2).mul(uint(175).div(2)).add(uint(50).mul(xp))
        ).sub(uint(175).div(2)).div(2);
    }

    function block_required_to_next_level(
        uint _soldier
    ) public view returns (uint block_required) {
        uint _level = get_solider_level(_soldier);

        block_required =
            uint(25).div(2).mul(_level.mul(_level)) +
            uint(175).div(2).mul(_level);
    }

    /*********************
     * EXTERNAL FUNCTION *
     *********************/

    function setLegionAddress(address _legion) external onlyOwner {
        require(LEGION == address(0), "LEGION already set");
        LEGION = _legion;
    }

    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function freeRecruit() external nonReentrant {
        require(
            freemint[msg.sender] < FREE_RECRUIT_LIMIT,
            "FREE_RECRUIT_LIMIT reached !"
        );
        freemint[msg.sender] = freemint[msg.sender].add(2);
        _recruit(0);
        _recruit(1);
    }

    function recruitClass(uint _class) external payable nonReentrant {
        require(msg.value == RECRUIT_PRICE, "Wrong msg.value for mint");
        _recruit(_class);
    }

    function recruit(
        uint recruit_number,
        uint _class
    ) external payable nonReentrant {
        require(
            msg.value == RECRUIT_PRICE.mul(recruit_number),
            "Wrong msg.value for mint"
        );
        for (uint i = 0; i < recruit_number; i++) {
            _recruit(_class);
        }
    }

    function setSoldierName(string memory _name, uint _id) external {
        require(
            ownerOf(_id) == msg.sender,
            "You are not the owner of this soldier"
        );
        require(bytes(_name).length <= 20, "Name too long");
        require(bytes(_name).length > 0, "Name too short");
        name[_id] = _name;
    }

    function captive(address _winner, address _loser, uint _id) external {
        require(
            msg.sender == LEGION,
            "Only LEGION contract can call this function"
        );
        // require(balanceOf(_loser) > 0, "Loser have no solider");
        require(
            ownerOf(_id) == _loser,
            "Loser are not the owner of this soldier"
        );
        _transfer(_loser, _winner, _id);
    }

    function changeTask(uint _id, uint _task) external {
        require(
            ownerOf(_id) == msg.sender,
            "You are not the owner of this soldier"
        );

        require(_task < 3, "Task not found");

        task[_id] = TASK(_task);
    }

    /********************
     * TOKENURI AND SVG *
     ********************/

    function tokenURI(
        uint256 _solider
    ) public view override returns (string memory) {
        string memory output = drawSvg(_solider);
        string memory attribute = getAttribute(_solider);
        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name":"',
                    name[_solider],
                    '",',
                    attribute,
                    ', "description": "BlockSolider is a fully on-chain game, with all game logic and resources stored on the blockchain.", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(output)),
                    '"}'
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function getAttribute(
        uint256 _solider
    ) public view returns (string memory attribute) {
        string memory classAttr = string.concat(
            '{"trait_type": "typer","value":"',
            classes(class[_solider]),
            '"},'
        );

        string memory levelAttr = string.concat(
            '{"trait_type": "Level","value":',
            Strings.toString(get_solider_level(_solider)),
            "}"
        );

        attribute = string.concat('"attributes":[', classAttr, levelAttr, "]");
    }

    function getSVGContent(
        uint256 _soldier
    ) public view returns (string memory content) {
        string memory soldier_name = string.concat(
            "Name:",
            " ",
            name[_soldier]
        );

        string memory soldier_type = string.concat(
            "Type:",
            " ",
            classes(class[_soldier])
        );

        string memory soldier_level = string.concat(
            "Level:",
            " ",
            Strings.toString(get_solider_level(_soldier))
        );

        content = string(
            abi.encodePacked(
                soldier_name,
                '</text><text x="10" y="40" class="base">',
                soldier_type,
                '</text><text x="10" y="60" class="base">',
                soldier_level
            )
        );
    }

    function drawSvg(
        uint256 _soldier
    ) public view returns (string memory output) {
        string
            memory head = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        string memory content = getSVGContent(_soldier);
        string memory tail = "</text></svg>";

        output = string(abi.encodePacked(head, content, tail));
    }
}
