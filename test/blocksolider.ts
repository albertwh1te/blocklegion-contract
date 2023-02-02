import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BlockSolider", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySolider() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Solider = await ethers.getContractFactory("BlockSoldier");
    const solider = await Solider.deploy();

    return { solider, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should Free Mint Two Solider ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      const provider = ethers.getDefaultProvider();
      let balance = await provider.getBalance(owner.address);
      console.log(`${owner.address} balance ${balance}}`);

      await solider.freeRecruit();

      expect(await solider.balanceOf(owner.address)).to.equal(2);
    });

    it("Shouldn't  Free Mint More Than Two Solider ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      const provider = ethers.getDefaultProvider();
      let balance = await provider.getBalance(owner.address);
      console.log(`${owner.address} balance ${balance}}`);

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
      ).to.be.rejectedWith("wrong msg.value for mint");
    });

    it("Should  Mint 5 Solider ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await solider.recruit(5, 1, { value: ethers.utils.parseEther("0.025") });
    });

    it("Shouldn't  Mint 5 Solider with 0.0005 ", async function () {
      const { solider, owner, otherAccount } = await loadFixture(deploySolider);

      await expect(
        solider.recruit(5, 1, { value: ethers.utils.parseEther("1") })
      ).to.be.rejectedWith("wrong msg.value for mint");
    });
  });
});
