const { expect } = require("chai")

/**
 * takes a big endian hex string number representation and returns both of
 * its endianness variants as simple js bigints.
 * @param {*} bigEndianLicenseIdHexString
 * @returns {{ le: bigint, be: bigint }} big and little endian license ids.
 */
function xEndianLicenseId(bigEndianLicenseIdHexString) {
  return {
    be: BigInt(bigEndianLicenseIdHexString),
    le: BigInt(
      "0x" +
        bigEndianLicenseIdHexString
          .match(/.{1,2}/g)
          .slice(1)
          .reverse()
          .join("")
    )
  }
}

describe("Tr3x", function () {
  const TR3X = 1
  const ZERO_ADDRESS = "0x" + "0".repeat(40)
  let tr3x,
    deployer,
    creator1,
    creator2,
    purchaser1,
    purchaser2,
    leaseLicenseId,
    exclusiveLicenseId

  before(async () => {
    ;[
      deployer,
      creator1,
      creator2,
      purchaser1,
      purchaser2,
      ...more
    ] = await ethers.getSigners()
    const Tr3x = await ethers.getContractFactory("Tr3x")
    // TODO: find a way to deploy as specific signer
    tr3x = await Tr3x.deploy()
  })

  describe("contract instantiation", () => {
    it("should assign the TR3X creator role to the deployer", async function () {
      const creatorOfTR3X = await tr3x.creators(TR3X)
      expect(creatorOfTR3X).to.equal(ZERO_ADDRESS)
    })
  })

  describe("license creation", () => {
    it("should create a lease license", async function () {
      // contract method inputs
      const metadataCid = "Qm" + "7".repeat(44)
      const price = 1000000n
      const isExclusive = false
      // expected outputs
      leaseLicenseId = xEndianLicenseId("0x0000000000000000000000000000000002")

      // kickin off license creation - signin the tx as creator1
      const licenseCreation = tr3x
        .connect(creator1)
        .create(metadataCid, price, isExclusive)

      // awaitin license creation - also signalled by events
      await expect(licenseCreation)
        // TransferSingle MUST be emitted following ERC-1155 Safe Transfer Rules
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          creator1.address,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          leaseLicenseId.le,
          0n
        )
        // following ERC-1155 an URI event SHOULD be emitted for mints
        .to.emit(tr3x, "URI")
        .withArgs(metadataCid, leaseLicenseId.le)

      // fetchin the license creator
      const licenseCreator = await tr3x.creators(leaseLicenseId.le)

      expect(licenseCreator).to.equal(creator1.address)

      // fetchin the license price
      const licensePrice = await tr3x.prices(leaseLicenseId.le)

      expect(licensePrice).to.equal(price)
    })

    it("should create an exclusive license", async function () {
      // contract method inputs
      const metadataCid = "Qm" + "5".repeat(44)
      const price = 1000419n
      const isExclusive = true
      // expected outputs
      exclusiveLicenseId = xEndianLicenseId(
        "0x0000000000000000000000000000000003"
      )

      // kickin off license creation - signin the tx as creator1
      const licenseCreation = tr3x
        .connect(creator2)
        .create(metadataCid, price, isExclusive)

      // awaitin license creation - also signalled by events
      await expect(licenseCreation)
        // TransferSingle MUST be emitted following ERC-1155 Safe Transfer Rules
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          creator1.address,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          exclusiveLicenseId.le,
          0n
        )
        // following ERC-1155 an URI event SHOULD be emitted for mints
        .to.emit(tr3x, "URI")
        .withArgs(metadataCid, exclusiveLicenseId.le)

      // fetchin the license creator
      const licenseCreator = await tr3x.creators(exclusiveLicenseId.le)

      expect(licenseCreator).to.equal(creator2.address)

      // fetchin the license price
      const licensePrice = await tr3x.prices(exclusiveLicenseId.le)

      expect(licensePrice).to.equal(price)
    })
  })

  it("should allow different parties to purchase the same lease license", async function () {
    
  })

  // it("should allow only one party to purchase an exclusive license", async function () {

  // })
})
