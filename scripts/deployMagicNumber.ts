import hre, { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("owner address:", owner.address);
  const RawMagicNumber = require("../artifacts/contracts/MagicNumber.yul/MagicNumber.json")
  const MagicNumber = await hre.ethers.getContractFactory([], RawMagicNumber.bytecode);
  const m = await MagicNumber.deploy();
  console.log("MagicNumber deployed to:", m.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
