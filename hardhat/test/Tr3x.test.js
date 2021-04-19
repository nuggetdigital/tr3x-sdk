const { expect } = require("chai")

/**
 * NOTE: the test suite depends on the order of its test cases as the
 * contract creates license token ids, that we assert() on, in an
 * incremental fashion.
 */
describe("Tr3x", function() {
  // TR3X will always be token id 1
  const TR3X = 1
  // what we mint to every wallet before testing
  const INITIAL_TR3X_BALANCE = 1000000000n
  // 🕳️
  const ZERO_ADDRESS = "0x" + "0".repeat(40)
  // mock lease license price
  const LEASE_LICENSE_PRICE = 1000000n
  // mock lease license metadata cid refing the metadata json doc on ipfs
  const LEASE_LICENSE_METADATA_CID = "Qm" + "7".repeat(44)
  // mock lease license id
  const LEASE_LICENSE_ID = BigInt("0x0200000000000000000000000000000000")
  // mock exclusive license price
  const EXCLUSIVE_LICENSE_PRICE = 1000419n
  // mock exclusive license metadata cid refing the metadata json doc on ipfs
  const EXCLUSIVE_LICENSE_METADATA_CID = "Qm" + "5".repeat(44)
  // mock exclusive license id - note the non-fungibility bit flag set
  const EXCLUSIVE_LICENSE_ID =
    BigInt("0x0300000000000000000000000000000000") | (1n << 255n)
  // the test global contract and identities
  let tr3x, deployer, lessor, exclusiveLicenseCreator, purchaser1, purchaser2

  before(async () => {
    ;[
      deployer,
      lessor,
      exclusiveLicenseCreator,
      purchaser1,
      purchaser2,
      purchaser3,
      ...more
    ] = await ethers.getSigners()

    const Tr3x = await ethers.getContractFactory("Tr3x")

    // TODO: find a way to deploy as specific signer
    tr3x = await Tr3x.deploy()

    await tr3x.mintNative(
      [
        deployer.address,
        lessor.address,
        exclusiveLicenseCreator.address,
        purchaser1.address,
        purchaser2.address,
        purchaser3.address,
      ],
      Array(5).fill(INITIAL_TR3X_BALANCE)
    )
  })

  describe("contract instantiation", () => {
    it("should assign the TR3X creator role to the deployer", async () => {
      const creatorOfTR3X = await tr3x.creators(TR3X)
      expect(creatorOfTR3X).to.equal(ZERO_ADDRESS)
    })
  })

  describe("license creation", () => {
    it("should create a lease license", async () => {
      // kickin off lease license creation - signin the tx as lessor
      const licenseCreation = tr3x
        .connect(lessor)
        // last param indicates non-fungibility aka isExclusive = false
        .create(LEASE_LICENSE_METADATA_CID, LEASE_LICENSE_PRICE, false)

      // awaitin license creation - also signalled by events
      await expect(licenseCreation)
        // TransferSingle MUST be emitted following ERC-1155 Safe Transfer Rules
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          lessor.address,
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

      expect(licenseCreator).to.equal(lessor.address)

      // fetchin the license price
      const licensePrice = await tr3x.prices(LEASE_LICENSE_ID)

      expect(licensePrice).to.equal(LEASE_LICENSE_PRICE)
    })

    it("should create an exclusive license", async () => {
      // kickin off license creation - signin the tx as exclusiveLicenseCreator
      const licenseCreation = tr3x
        .connect(exclusiveLicenseCreator)
        // last param indicates non-fungibility aka isExclusive = true
        .create(EXCLUSIVE_LICENSE_METADATA_CID, EXCLUSIVE_LICENSE_PRICE, true)

      // awaitin license creation - also signalled by events
      await expect(licenseCreation)
        // TransferSingle MUST be emitted following ERC-1155 Safe Transfer Rules
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          exclusiveLicenseCreator.address,
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

      expect(licenseCreator).to.equal(exclusiveLicenseCreator.address)

      // fetchin the license price
      const licensePrice = await tr3x.prices(EXCLUSIVE_LICENSE_ID)

      expect(licensePrice).to.equal(EXCLUSIVE_LICENSE_PRICE)
    })
  })

  describe("lease license purchases", () => {
    it("should allow different parties to purchase the same lease license", async () => {
      const purchaser1Price = LEASE_LICENSE_PRICE
      const purchaser2Price = LEASE_LICENSE_PRICE + 419n

      // kickin off a license purchase as purchaser1
      const licensePurchase1 = tr3x
        .connect(purchaser1)
        // purchaser1 is only payin the minimum price
        .purchase(LEASE_LICENSE_ID, purchaser1Price)

      // awaitin license creation - also signalled by events
      await expect(licensePurchase1)
        // TransferSingle event for the TR3X payment
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          tr3x.address,
          purchaser1.address,
          lessor.address,
          TR3X,
          purchaser1Price
        )
        // TransferSingle event for the license token transfer
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          tr3x.address,
          ZERO_ADDRESS,
          purchaser1.address,
          LEASE_LICENSE_ID,
          1n
        )

      // fetchin the post purchase lessee and lessor balances
      const purchaser1BalanceTR3X = await tr3x.balanceOf(
        purchaser1.address,
        TR3X
      )

      expect(purchaser1BalanceTR3X).to.equal(
        INITIAL_TR3X_BALANCE - purchaser1Price
      )

      let lessorBalanceTR3X = await tr3x.balanceOf(lessor.address, TR3X)

      expect(lessorBalanceTR3X).to.equal(INITIAL_TR3X_BALANCE + purchaser1Price)

      const purchaser1BalanceLeaseLicenseToken = await tr3x.balanceOf(
        purchaser1.address,
        LEASE_LICENSE_ID
      )

      expect(purchaser1BalanceLeaseLicenseToken).to.equal(1n)

      // kickin off a license purchase as purchaser2
      const licensePurchase2 = tr3x
        .connect(purchaser2)
        // purchaser1 is only payin the minimum price
        .purchase(LEASE_LICENSE_ID, purchaser2Price)

      // awaitin license creation - also signalled by events
      await expect(licensePurchase2)
        // TransferSingle event for the TR3X payment
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          tr3x.address,
          purchaser2.address,
          lessor.address,
          TR3X,
          purchaser2Price
        )
        // TransferSingle event for the license token transfer
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          tr3x.address,
          ZERO_ADDRESS,
          purchaser2.address,
          LEASE_LICENSE_ID,
          1n
        )

      // fetchin the post purchase lessee and lessor balances
      const purchaser2BalanceTR3X = await tr3x.balanceOf(
        purchaser2.address,
        TR3X
      )

      expect(purchaser2BalanceTR3X).to.equal(
        INITIAL_TR3X_BALANCE - purchaser2Price
      )

      lessorBalanceTR3X = await tr3x.balanceOf(lessor.address, TR3X)

      expect(lessorBalanceTR3X).to.equal(
        INITIAL_TR3X_BALANCE + purchaser1Price + purchaser2Price
      )

      const purchaser2BalanceLeaseLicenseToken = await tr3x.balanceOf(
        purchaser2.address,
        LEASE_LICENSE_ID
      )

      expect(purchaser2BalanceLeaseLicenseToken).to.equal(1n)
    })

    it("should fail if not paying the minimum price", async () => {
      const purchaser2Price = LEASE_LICENSE_PRICE - 1n

        // kickin off a license purchase as purchaser3
        const licensePurchase3 = tr3x
        .connect(purchaser3)
        // purchaser3 is payin less than the minimum price
        .purchase(LEASE_LICENSE_ID, purchaser3Price)

      // awaitin license creation - also signalled by events
      await expect(licensePurchase3)
// TODO to fail

    })

    // it("should fail if the license token does not exist", async () => {})
  })

  // describe("exclusive license purchases", () => {
  //   it("should allow only one party to purchase an exclusive license", async () => {})

  //   it("should fail if the exclusive license token has already been purchased", async () => {})

  //   it("should fail if not paying the minimum price", async () => {})

  //   it("should fail if the license token does not exist", async () => {})
  // })

  // describe("license deactivation", () => {
  //   it("it should fail for non-creators", async () => {})

  //   it("should disallow purchasing deactivated license tokens", async () => {})
  // })

  // describe("license reactivation", () => {
  //   it("it should fail for non-creators", async () => {})

  //   it("should allow purchasing reactivated license tokens", async () => {})
  // })

  // describe license claims TODO
})
