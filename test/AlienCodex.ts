import hre, { ethers } from "hardhat";
import { expect } from "chai";

describe("AlienCodex", function () {
    async function deploy() {
        const [owner, otherAccount] = await ethers.getSigners();

        const AlienCodex = await ethers.getContractFactory("AlienCodex");
        const AlienCodexPOC = await ethers.getContractFactory("AlienCodexPOC");

        const ac = await AlienCodex.attach('0xB52577F64Ffac16f545D31FA846098B73e6F73C8');
        // const ac = await AlienCodex.deploy();
        const ap = await AlienCodexPOC.deploy(ac.address);
        
        console.log(ac.address);
        console.log(ap.address);

        return { owner, otherAccount };
    }

    describe("Crack", function () {
        it("bingo", async function () {
            await deploy();
        });
    });

});
