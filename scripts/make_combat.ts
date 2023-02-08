import hre from "hardhat";

let soldierAddress = "0x1f57a9A6199aDCAc53c738fBAbe451cD33c5b076";
let battleAddress = "0xa301712ffc2258F4de2EeCFe20AA4cC156804c18";
let legionAddress = "0x6CAf91E6167799f01ac7a56b0ec44C7216D20140";

async function main() {
  console.log("start make combat");
  const accounts = await hre.ethers.getSigners();

  console.log(legionAddress, "load soldier");
  const soldier = await hre.ethers.getContractAt(
    "BlockSoldier",
    soldierAddress
  );

  console.log(legionAddress, "load battle");
  const Battle = await hre.ethers.getContractFactory("BattleSystem");
  const battle = await Battle.attach(battleAddress);
  console.log(battle.address);

  console.log(legionAddress, "load legion");
  const legion = await hre.ethers.getContractAt("BlockLegion", legionAddress);
  console.log(legion.address);

  let balance = await soldier.balanceOf(accounts[0].address);
  let balance2 = await soldier.balanceOf(accounts[1].address);
  let balance3 = await soldier.balanceOf(accounts[2].address);

  console.log(balance, balance2, balance3);

  // console.log("try mint");
  // await soldier.connect(accounts[1]).freeRecruit();
  // await soldier.connect(accounts[2]).freeRecruit();

  console.log("try change");
  await soldier.changeTask(0, 1);

  console.log("set legion name");
  await legion.connect(accounts[0]).setLegionName("Iron Legion");

  // start war here
  if (balance3.lt(0)) {
    console.log("recruit", accounts[3].address);
    await soldier.connect(accounts[3]).freeRecruit();
  }

  let result = await legion.connect(accounts[3]).war(accounts[0].address);
  console.log("war", result);

  console.log("level", await soldier.get_solider_level(0));

  console.log(await battle.getSoldierAttackPower(0));
  console.log(await battle.getSoldierDefensePower(0));

  console.log("1 balance", balance);
  console.log("2 balance", balance2);

  console.log(await legion.getAttackPower(accounts[0].address));
  console.log(await legion.getDefensePower(accounts[0].address));
  console.log(await legion.getAttackPower(accounts[3].address));
  console.log(await legion.getDefensePower(accounts[3].address));

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
