const { expect } = require("chai");

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

    // console.log(receipt)

const transferSingleEvent = receipt.events.find(event => {
  return event.eventSignature === "TransferSingle(address,address,address,uint256,uint256)"
})

    const uriEvent = receipt.events.find(event => {
      return event.eventSignature === "URI(string,uint256)"
    })



    // const transferSingleEvent = receipt.events[0]
    // const purchaseEvent = receipt.events[0]

    // console.log(transferSingleEvent)
    // console.log()
    // console.log(transferSingleEvent.args)

    // const tokenIdRaw = transferSingleEvent.args._id.toHexString()

    const tokenId = uriEvent.args._id

    console.log("tokenId", tokenId)


    // expect(transferSingleEvent).to.equal()
      // await expect(
      // )
      // .to.emit(tr3x, 'TransferSingle')
      // .withArgs(creator1.address, address(0x0), address(0x0), tokenId, 0)

    // assert emit TransferSingle(msg.sender, address(0x0), address(0x0), _type, 0);
    // assert emit URI(_uri, _type);

// console.log("$$$$$$$$",tokenId)

    // assert id == 2
    expect(tokenId).to.equal(2n)

    // assert creators[tokenId] == TODO
    const creator1Address = await tr3x.creators(tokenId)
    expect(creator1Address).to.equal(creator1.address)

    // assert prices[tokenId] == price
    const tokenPrice = await tr3x.prices(tokenId)
    expect(tokenPrice).to.equal(price)
  });
});