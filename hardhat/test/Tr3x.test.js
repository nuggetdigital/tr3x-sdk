const { expect } = require("chai")

/**
 * NOTE: the test suite depends on the order of its test cases as the
 * contract creates license token ids, that we assert() on, in an
 * incremental fashion.
 */
describe("Tr3x", function () {
  const TR3X = 1
  const ZERO_ADDRESS = "0x" + "0".repeat(40)
  const LEASE_LICENSE_PRICE = 1000000n
  const LEASE_LICENSE_METADATA_CID = "Qm" + "7".repeat(44)
  const LEASE_LICENSE_ID = BigInt("0x0200000000000000000000000000000000")
  const EXCLUSIVE_LICENSE_PRICE = 1000419n
  const EXCLUSIVE_LICENSE_METADATA_CID = "Qm" + "5".repeat(44)
  const EXCLUSIVE_LICENSE_ID =
    BigInt("0x0300000000000000000000000000000000") | (1n << 255n)
  let tr3x, deployer, creator1, creator2, purchaser1, purchaser2

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
      // kickin off lease license creation - signin the tx as creator1
      const licenseCreation = tr3x
        .connect(creator1)
        // last param indicates non-fungibility aka isExclusive = false
        .create(LEASE_LICENSE_METADATA_CID, LEASE_LICENSE_PRICE, false)

      // awaitin license creation - also signalled by events
      await expect(licenseCreation)
        // TransferSingle MUST be emitted following ERC-1155 Safe Transfer Rules
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          creator1.address,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          LEASE_LICENSE_ID,
          0n
        )
        // following ERC-1155 an URI event SHOULD be emitted for mints
        .to.emit(tr3x, "URI")
        .withArgs(LEASE_LICENSE_METADATA_CID, LEASE_LICENSE_ID)

      // fetchin the license creator
      const licenseCreator = await tr3x.creators(LEASE_LICENSE_ID)

      expect(licenseCreator).to.equal(creator1.address)

      // fetchin the license price
      const licensePrice = await tr3x.prices(LEASE_LICENSE_ID)

      expect(licensePrice).to.equal(LEASE_LICENSE_PRICE)
    })

    it("should create an exclusive license", async function () {
      // kickin off license creation - signin the tx as creator1
      const licenseCreation = tr3x
        .connect(creator2)
        // last param indicates non-fungibility aka isExclusive = true
        .create(EXCLUSIVE_LICENSE_METADATA_CID, EXCLUSIVE_LICENSE_PRICE, true)

      // awaitin license creation - also signalled by events
      await expect(licenseCreation)
        // TransferSingle MUST be emitted following ERC-1155 Safe Transfer Rules
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          creator2.address,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          EXCLUSIVE_LICENSE_ID,
          0n
        )
        // following ERC-1155 an URI event SHOULD be emitted for mints
        .to.emit(tr3x, "URI")
        .withArgs(EXCLUSIVE_LICENSE_METADATA_CID, EXCLUSIVE_LICENSE_ID)

      // fetchin the license creator
      const licenseCreator = await tr3x.creators(EXCLUSIVE_LICENSE_ID)

      expect(licenseCreator).to.equal(creator2.address)

      // fetchin the license price
      const licensePrice = await tr3x.prices(EXCLUSIVE_LICENSE_ID)

      expect(licensePrice).to.equal(EXCLUSIVE_LICENSE_PRICE)
    })
  })

  // it("should allow different parties to purchase the same lease license", async function () {
  //   // contract method inputs
  //   // TODO
  // })

  // it("should allow only one party to purchase an exclusive license", async function () {})
})
