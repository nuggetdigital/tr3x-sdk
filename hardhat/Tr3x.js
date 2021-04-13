const { expect } = require("chai");

describe("Tr3x", function() {
  const TR3X = 1
  let owner 
  let tr3x

  beforeAll(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0]
    const Tr3x = await ethers.getContractFactory("Tr3x");
    tr3x = await Tr3x.deploy();
    console.log("tr3x", tr3x)
  })

  // Using a different acount `<contract>.connect(addr1)` 

  it("should run", () => {
    expect(1+1).to.equal(2)
  })

  it("should assign the TR3X creator role to the owner", async function() {
    const creatorOfTR3X = await tr3x.creators(TR3X);
    expect(creatorOfTR3X).to.equal(owner);
  });
});