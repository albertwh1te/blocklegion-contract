import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

describe("BlockSolider", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySolider() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Solider = await ethers.getContractFactory("BlockSoldier");
    const solider = await Solider.deploy();

    return { solider, owner, otherAccount };
  }

  async function deployAll() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Solider = await ethers.getContractFactory("BlockSoldier");
    const solider = await Solider.deploy();

    const Battle = await ethers.getContractFactory("BattleSystem");
    // uint
    const battle = await Battle.deploy(solider.address);

    const Legion = await ethers.getContractFactory("BlockLegion");
    const legion = await Legion.deploy(solider.address);

    await legion.setBattleSystem(battle.address);
    await solider.setLegionAddress(legion.address);

    return { solider, battle, legion, owner, otherAccount };
  }

  describe("Soldier Function", function () {
    it("Should Free Mint Two Solider ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.freeRecruit();

      expect(await solider.balanceOf(owner.address)).to.equal(2);
    });

    it("Shouldn't  Free Mint More Than Two Solider ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      // mint two free
      await solider.freeRecruit();

      // should fail next time
      await expect(solider.freeRecruit()).to.be.rejectedWith(
        "FREE_RECRUIT_LIMIT reached !"
      );

      expect(await solider.balanceOf(owner.address)).to.equal(2);
    });

    it("Should Mint 1 Archer with 0.001", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.recruitClass(2, {
        value: ethers.utils.parseEther("0.005"),
      });
    });

    it("Should Mint 1 Solider with 0.001", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.recruit(1, 1, { value: ethers.utils.parseEther("0.005") });
    });

    it("Shouldn't Mint 1 Solider with 0.00001", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await expect(
        solider.recruit(1, 1, { value: ethers.utils.parseEther("0.00001") })
      ).to.be.reverted;
    });

    it("Should  Mint 5 Solider ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.recruit(5, 1, { value: ethers.utils.parseEther("0.025") });
    });

    it("Shouldn't  Mint 5 Solider with 0.0005 ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await expect(
        solider.recruit(5, 1, { value: ethers.utils.parseEther("1") })
      ).to.be.reverted;
    });

    it("Check Token URI Is Right format", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.recruit(1, 1, { value: ethers.utils.parseEther("0.005") });

      await solider.setSoldierName("test", 0);

      await mine(3600 * 3 * 24 * 365);

      let data = await solider.tokenURI(0);

      let raw = Buffer.from(data.substring(29), "base64").toString();

      let result = JSON.parse(raw);

      expect(result.name).to.equal("test");
    });

    it("set soldier name", async () => {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.freeRecruit();

      await solider.setSoldierName("alice", 0);

      await solider.setSoldierName("test", 0);
    });

    it("test change task", async () => {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.freeRecruit();

      let oldTask = await solider.task(0);

      expect(oldTask).to.equal(1);

      await solider.changeTask(0, 0);

      let task = await solider.task(0);

      expect(task).to.equal(0);

      await solider.changeTask(0, 1);

      task = await solider.task(0);

      expect(task).to.equal(1);
    });

    it("test captive", async () => {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.connect(owner).freeRecruit();

      await solider.connect(otherAccount).freeRecruit();

      await solider.setLegionAddress(otherAccount.address);

      expect(await solider.balanceOf(owner.address)).to.equal(2);

      expect(await solider.balanceOf(otherAccount.address)).to.equal(2);

      let solider_id = await solider.tokenOfOwnerByIndex(owner.address, 0);

      await solider
        .connect(otherAccount)
        .captive(otherAccount.address, owner.address, solider_id);

      expect(await solider.balanceOf(owner.address)).to.equal(1);

      expect(await solider.balanceOf(otherAccount.address)).to.equal(3);

      expect(await solider.ownerOf(solider_id)).to.equal(otherAccount.address);
    });
  });

  describe("Legion Function", function () {
    it("Legion: check ap and dp", async () => {
      const { solider, battle, legion, owner, otherAccount } =
        await loadFixture(deployAll);

      await solider.freeRecruit();

      await solider.recruitClass(2, {
        value: ethers.utils.parseEther("0.005"),
      });

      let ap = await legion.getAttackPower(owner.address);
      let dp = await legion.getDefensePower(owner.address);

      expect(ap).to.equal(0);
      expect(dp).to.equal(0);

      await mine(getRandomInt(10, 10000));

      ap = await legion.getAttackPower(owner.address);
      dp = await legion.getDefensePower(owner.address);

      let offlineAp: BigNumber = BigNumber.from(0);
      let offlineDp = BigNumber.from(0);

      for (let index = 0; index < 3; index++) {
        let sap = await battle.getSoldierAttackPower(index);
        let dap = await battle.getSoldierDefensePower(index);
        let task = await solider.task(index);
        if (task == 0) {
          offlineDp = offlineDp.add(dap);
        } else {
          offlineAp = offlineAp.add(sap);
        }
      }
      expect(offlineAp).to.equal(ap);
      expect(offlineDp).to.equal(dp);
    });

    it("Legion: check balance after battle", async () => {
      const { solider, battle, legion, owner, otherAccount } =
        await loadFixture(deployAll);

      await solider.freeRecruit();

      await solider.recruitClass(2, {
        value: ethers.utils.parseEther("0.005"),
      });

      await solider.connect(otherAccount).freeRecruit();

      expect(await solider.balanceOf(owner.address)).to.equal(3);
      expect(await solider.balanceOf(otherAccount.address)).to.equal(2);

      await mine(getRandomInt(10, 10000));

      await legion.war(otherAccount.address);

      expect(await solider.balanceOf(owner.address)).to.equal(4);
      expect(await solider.balanceOf(otherAccount.address)).to.equal(1);

      await mine(getRandomInt(10, 10000));

      await legion.war(otherAccount.address);

      expect(await solider.balanceOf(owner.address)).to.equal(5);
      expect(await solider.balanceOf(otherAccount.address)).to.equal(0);

      await expect(legion.war(otherAccount.address)).to.be.revertedWith('No soldier');

    });
  });
});
