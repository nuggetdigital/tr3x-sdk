const { expect } = require("chai");

function littleEndianHexToBigInt(hex) {
  if (hex.toHexString) hex = hex.toHexString()
  return BigInt("0x" + hex.match(/.{1,2}/g).slice(1).reverse().join(''))
}

describe("Tr3x", function() {
  const TR3X = 1
  let tr3x
  let creator1

  before(async () => {
    [creator1, ...more] = await ethers.getSigners()
    const Tr3x = await ethers.getContractFactory("Tr3x");
    tr3x = await Tr3x.deploy();
  })

  it("should assign the TR3X creator role to the deployer", async function() {
    const creatorOfTR3X = await tr3x.creators(TR3X);
    expect(creatorOfTR3X).to.equal("0x" + "0".repeat(40));
  })

  it("should create a lease license", async function() {
    const metadataCid = "Qm" + "7".repeat(44)
    const trackPrice = 1000000n
    const isNonFungible = false

    const tx = await tr3x
      .connect(creator1)
      .create(metadataCid, trackPrice, isNonFungible)

    const receipt = await tx.wait()

    const transferSingleEvent = receipt.events.find(event => 
      event.eventSignature === "TransferSingle(address,address,address,uint256,uint256)")

    const uriEvent = receipt.events.find(event => 
      event.eventSignature === "URI(string,uint256)")

    // TODO: MK SR W€ HV SN@PSH0T LYK TSTS
    // assert emit TransferSingle(msg.sender, address(0x0), address(0x0), _type, 0);
    // assert emit URI(_uri, _type);

    console.log("$$$$ uriEvent", uriEvent)

    // NOTE: transformin from le -> be, then interpretin it as bigint
    const tokenId = littleEndianHexToBigInt(uriEvent.args._id)
    expect(tokenId).to.equal(2n)

    const creator1Address = await tr3x.creators(tokenId)
    console.log("$$$ creator1Address", creator1Address)
    // FAILS
    expect(creator1Address).to.equal(creator1.address)

    const tokenPrice = littleEndianHexToBigInt(await tr3x.prices(tokenId))
    console.log("$$$ tokenPrice",tokenPrice)
    // FAILS
    expect(tokenPrice).to.equal(trackPrice)
  })
})