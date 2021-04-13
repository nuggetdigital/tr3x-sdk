const { expect } = require("chai");

describe("Tr3x", function() {
  const TR3X = 1
  let tr3x

  before(async () => {
    const Tr3x = await ethers.getContractFactory("Tr3x");
    tr3x = await Tr3x.deploy();
  })

  // Using a different acount `<contract>.connect(addr1)` 

  it("should assign the TR3X creator role to the deployer", async function() {
    const creatorOfTR3X = await tr3x.creators(TR3X);
    expect(creatorOfTR3X).to.equal("0x" + null);
  });
});