import { ethers } from "hardhat";

let soldierAddress = '0xf01fC34bEA21a6f4C1860e8666C7e2aF90956922'
let battleAddress= '0x93DEF6490d992E48174DC7fB45C1681927d574B0'
let legionAddress='0x0c40b06C9AEA53467Ab83635A59c7C211238eB91'



async function main() {
  console.log("start make combat");
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
