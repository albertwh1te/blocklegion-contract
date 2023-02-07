import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();

  const Soldier = await ethers.getContractFactory("BlockSoldier");
  const soldier = await Soldier.deploy();

  const Battle = await ethers.getContractFactory("BattleSystem");
  // uint
  const battle = await Battle.deploy(soldier.address);

  const Legion = await ethers.getContractFactory("BlockLegion");
  const legion = await Legion.deploy(soldier.address);

  await soldier.freeRecruit();
  await soldier.recruitClass(2, { value: ethers.utils.parseEther("0.005") });

  await soldier.connect(accounts[1]).freeRecruit();

  await legion.setBattleSystem(battle.address);
  await soldier.setLegionAddress(legion.address);

  await legion.deployTransaction.wait(6);
  let balance = await soldier.balanceOf(accounts[0].address);
  let balance2 = await soldier.balanceOf(accounts[1].address);

  console.log("level", await soldier.get_solider_level(0));
  console.log("soldier ap", await battle.getSoldierAttackPower(0));
  console.log("soldier dp", await battle.getSoldierDefensePower(0));

  let ap = await legion.getAttackPower(accounts[0].address);
  let dp = await legion.getDefensePower(accounts[1].address);

  console.log("ap", ap, "dp", dp);

  console.log(balance, balance2);

  await legion.war(accounts[1].address);

  // await legion.war(accounts[1].address);

  await legion.deployTransaction.wait(6);
  balance = await soldier.balanceOf(accounts[0].address);
  balance2 = await soldier.balanceOf(accounts[1].address);

  console.log(balance, balance2);

  console.log(await legion.getLegionSoldiers(accounts[0].address));

  console.log(
    `let soldierAddress = '${soldier.address}' \nlet battleAddress= '${battle.address}' \nlet legionAddress='${legion.address}'`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
