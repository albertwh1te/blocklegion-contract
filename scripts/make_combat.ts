import { ethers } from "hardhat";

let soldierAddress = "0x12AA426F676e454763518B51A7BE4D6d7d23f60B";
let battleAddress = "0xAb4F2B6BABfeF633f673aC996C41F96Ec4A7863B";
let legionAddress = "0x7C54C07410b84c13D64A4CB9618A1ff745dcd619";

async function main() {
  console.log("wwwwww");
  const accounts = await ethers.getSigners();

  const Soldier = await ethers.getContractFactory("BlockSoldier");
  const soldier = await Soldier.attach(soldierAddress);

  console.log(soldier.address);

  const Battle = await ethers.getContractFactory("BattleSystem");
  const battle = await Battle.attach(battleAddress);
  console.log(battle.address);

  console.log(legionAddress, "wwww");
  const Legion = await ethers.getContractFactory("BlockLegion");
  const legion = await Legion.attach(legionAddress);
  console.log(legion.address);

  let balance = await soldier.balanceOf(accounts[0].address);
  let balance2 = await soldier.balanceOf(accounts[1].address);

  //  make war here
  let result = await legion.connect(accounts[0]).war(accounts[1].address);
  console.log("war", result);

  console.log("level", await soldier.get_solider_level(0));

  console.log(await battle.getSoldierAttackPower(0));
  console.log(await battle.getSoldierDefensePower(0));

  console.log("1 balance", balance);
  console.log("2 balance", balance2);

  console.log(await legion.getAttackPower(accounts[0].address));
  console.log(await legion.getDefensePower(accounts[0].address));

  console.log("battle");
  console.log(await battle.getSoldierAttackPower(1));
  console.log(await battle.getSoldierDefensePower(1));

  console.log("finished");

  return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
