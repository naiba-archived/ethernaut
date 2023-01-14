import { ethers } from "hardhat";

describe("GatekeeperOne", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const GatekeeperOne = await ethers.getContractFactory("GatekeeperOne");
    const GatekeeperOnePOC = await ethers.getContractFactory("GatekeeperOnePOC");
    const g = await GatekeeperOne.deploy();
    const gpoc = await GatekeeperOnePOC.deploy();

    return { g, gpoc, owner, otherAccount };
  }

  describe("Crack", function () {
    it("bingo", async function () {
      const { g, gpoc } = await deploy();
      await gpoc.bingo(g.address);
      console.log(await gpoc.ret());
    });

    it("bingo2", async function () {
      const { g, gpoc } = await deploy();
      await gpoc.crack(g.address, 205031);
    });
  });

});
