const { expect } = require("chai");

describe("Tr3x", function() {
  const TR3X = 1
  let tr3x

  before(async () => {
    const Tr3x = await ethers.getContractFactory("Tr3x");
    tr3x = await Tr3x.deploy();
  })

  it("should assign the TR3X creator role to the deployer", async function() {
    const creatorOfTR3X = await tr3x.creators(TR3X);
    expect(creatorOfTR3X).to.equal("0x" + "0".repeat(40));
  })

  it("should create an exclusive license aka a non-fungible token", async function() {
    const creator = ethers.Wallet.createRandom()
    const metadataCid = "Qm" + "7".repeat(44)
    const trackPrice = 1000000n
    const isExclusive = true

    const tokenId = await expect(
        await tr3x
          .connect(creator)
          .create(metadataCid, trackPrice, isExclusive)
      )
      .to.emit(tr3x, 'TransferSingle')
      .withArgs(creator.address, address(0x0), address(0x0), tokenId, 0)

    // assert emit TransferSingle(msg.sender, address(0x0), address(0x0), _type, 0);
    // assert emit URI(_uri, _type);

    // assert id == 2
    expect(tokenId).to.equal(2)

    // assert creators[tokenId] == TODO
    const creatorAddress = await tr3x.creators(tokenId)
    expect(creatorAddress).to.equal(creator.address)

    // assert prices[tokenId] == price
    const tokenPrice = await tr3x.prices(tokenId)
    expect(tokenPrice).to.equal(price)
  });
});