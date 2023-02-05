import { ethers } from "hardhat";

async function main() {
  const Soldier = await ethers.getContractFactory("BlockSoldier");
  const soldier = await Soldier.deploy();

  const Battle = await ethers.getContractFactory("BattleSystem");
  // uint
  const battle = await Battle.deploy(soldier.address);

  const Legion = await ethers.getContractFactory("BlockLegion");
  const legion = await Legion.deploy(soldier.address);

  await legion.setBattleSystem(battle.address);
  await soldier.setLegionAddress(legion.address);

  await soldier.freeRecruit();

  console.log(
    `soldier: ${soldier.address} \nbattle: ${battle.address} \nlegion: ${legion.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
