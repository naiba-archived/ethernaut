import hre, { ethers } from "hardhat";
import { expect } from "chai";

describe("MagicNumber", function () {
    async function deploy() {
        const [owner, otherAccount] = await ethers.getSigners();

        const RawMagicNumber = require("../artifacts/contracts/MagicNumber.yul/MagicNumber.json")
        const MagicNumber = await hre.ethers.getContractFactory([], RawMagicNumber.bytecode);

        const m = await MagicNumber.deploy();

        return { m, owner, otherAccount };
    }

    describe("Get 42", function () {
        it("bingo", async function () {
            const { m } = await deploy();
            let ret = await ethers.provider.call({
                to: m.address,
                data: "0xff",
            });
            expect(BigInt(ret).toString()).equal("42");
        });

    });

});
