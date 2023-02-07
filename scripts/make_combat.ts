import { ethers } from "hardhat";

let soldierAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
let battleAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
let legionAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  console.log("wwwwww");
  const accounts = await ethers.getSigners();

  const Soldier = await ethers.getContractFactory("BlockSoldier");
  const soldier = await Soldier.attach(soldierAddress);

  const Battle = await ethers.getContractFactory("BattleSystem");
  const battle = await Battle.deploy(battleAddress);

  const Legion = await ethers.getContractFactory("BlockLegion");
  const legion = await Legion.deploy(legionAddress);

  legion.getAttackPower(0)

  // console.log("wwwwww");
  // console.log(accounts);
  // console.log(accounts[0]);

  let balance = await soldier.balanceOf(accounts[0].address);
  let balance2 = await soldier.balanceOf(accounts[1].address);

  console.log("level", await soldier.get_solider_level(0));
  console.log(balance);
  console.log(balance2);

  console.log(await legion.getAttackPower(accounts[0].address));
  console.log(await legion.getDefensePower(accounts[0].address));



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
