const { expect } = require("chai")

/**
 * NOTE: the test suite depends on the order of its test cases as the
 * contract creates license token ids, that we assert() on, in an
 * incremental fashion, and we are tracin **global** balances throughout
 * the test suite.
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
  let tr3x, lessor, exclusiveLicenseCreator, purchaser1, purchaser2

  before(async () => {
    const Tr3x = await ethers.getContractFactory("Tr3x")

    // TODO: find a way to deploy as specific signer
    tr3x = await Tr3x.deploy()
    ;[
      lessor,
      exclusiveLicenseCreator,
      purchaser1,
      purchaser2,
      purchaser3
    ] = await ethers.getSigners()

    await tr3x.mintNative(
      [
        lessor.address,
        exclusiveLicenseCreator.address,
        purchaser1.address,
        purchaser2.address,
        purchaser3.address
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

    it("should list all current offers incl. an exclusive", async () => {
      const offers = await tr3x.currentOffers()

      expect(offers).to.deep.equal([
        [LEASE_LICENSE_METADATA_CID, ethers.BigNumber.from(LEASE_LICENSE_ID)],
        [
          EXCLUSIVE_LICENSE_METADATA_CID,
          ethers.BigNumber.from(EXCLUSIVE_LICENSE_ID)
        ]
      ])
    })
  })

  describe("license purchases", () => {
    it("should fail if the license token does not exist", async () => {
      const licensePurchase = tr3x.connect(purchaser1).purchase(419n, 1n)

      await expect(licensePurchase).to.be.revertedWith("token does not exist")
    })

    describe("lease license purchases", () => {
      it("should fail if not paying the minimum price", async () => {
        const licensePurchase = tr3x
          .connect(purchaser1)
          .purchase(LEASE_LICENSE_ID, LEASE_LICENSE_PRICE - 1n)

        await expect(licensePurchase).to.be.revertedWith("price too low")
      })

      it("should allow different parties to purchase the same lease license", async () => {
        // purchaser1 is only payin the minimum price
        const purchaser1Price = LEASE_LICENSE_PRICE
        // purchaser2 is payin more
        const purchaser2Price = LEASE_LICENSE_PRICE + 419n

        // kickin off a license purchase as purchaser1
        const licensePurchase1 = tr3x
          .connect(purchaser1)
          .purchase(LEASE_LICENSE_ID, purchaser1Price)

        // awaitin license creation
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

        const purchaser1TR3XBalance = await tr3x.balanceOf(
          purchaser1.address,
          TR3X
        )

        expect(purchaser1TR3XBalance).to.equal(
          INITIAL_TR3X_BALANCE - purchaser1Price
        )

        let lessorTR3XBalance = await tr3x.balanceOf(lessor.address, TR3X)

        expect(lessorTR3XBalance).to.equal(
          INITIAL_TR3X_BALANCE + purchaser1Price
        )

        const purchaser1LeaseLicenseTokenBalance = await tr3x.balanceOf(
          purchaser1.address,
          LEASE_LICENSE_ID
        )

        expect(purchaser1LeaseLicenseTokenBalance).to.equal(1n)

        // kickin off a license purchase as purchaser2
        const licensePurchase2 = tr3x
          .connect(purchaser2)
          .purchase(LEASE_LICENSE_ID, purchaser2Price)

        // awaitin license creation
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

        const purchaser2TR3XBalance = await tr3x.balanceOf(
          purchaser2.address,
          TR3X
        )

        expect(purchaser2TR3XBalance).to.equal(
          INITIAL_TR3X_BALANCE - purchaser2Price
        )

        lessorTR3XBalance = await tr3x.balanceOf(lessor.address, TR3X)

        expect(lessorTR3XBalance).to.equal(
          INITIAL_TR3X_BALANCE + purchaser1Price + purchaser2Price
        )

        const purchaser2LeaseLicenseTokenBalance = await tr3x.balanceOf(
          purchaser2.address,
          LEASE_LICENSE_ID
        )

        expect(purchaser2LeaseLicenseTokenBalance).to.equal(1n)
      })

      it("should list lease license tokens held by given addresses", async () => {
        const licensesHeldByPurchaser1 = await tr3x.licensesHeldBy(
          purchaser1.address
        )
        const licensesHeldByPurchaser2 = await tr3x.licensesHeldBy(
          purchaser2.address
        )

        expect(licensesHeldByPurchaser1).to.deep.equal([
          [LEASE_LICENSE_METADATA_CID, ethers.BigNumber.from(LEASE_LICENSE_ID)]
        ])
        expect(licensesHeldByPurchaser2).to.deep.equal([
          [LEASE_LICENSE_METADATA_CID, ethers.BigNumber.from(LEASE_LICENSE_ID)]
        ])
      })
    })

    describe("exclusive license purchases", () => {
      it("should fail if not paying the minimum price", async () => {
        const licensePurchase = tr3x
          .connect(purchaser1)
          .purchase(EXCLUSIVE_LICENSE_ID, EXCLUSIVE_LICENSE_PRICE - 1n)

        await expect(licensePurchase).to.be.revertedWith("price too low")
      })

      it("should allow the first one interested to purchase an exclusive license", async () => {
        // the EXCLUSIVE_LICENSE_ID has not been bought by anyone yet
        const licensePurchase = tr3x
          .connect(purchaser3)
          .purchase(EXCLUSIVE_LICENSE_ID, EXCLUSIVE_LICENSE_PRICE)

        // awaitin license creation
        await expect(licensePurchase)
          // TransferSingle event for the TR3X payment
          .to.emit(tr3x, "TransferSingle")
          .withArgs(
            tr3x.address,
            purchaser3.address,
            exclusiveLicenseCreator.address,
            TR3X,
            EXCLUSIVE_LICENSE_PRICE
          )
          // TransferSingle event for the license token transfer
          .to.emit(tr3x, "TransferSingle")
          .withArgs(
            tr3x.address,
            ZERO_ADDRESS,
            purchaser3.address,
            EXCLUSIVE_LICENSE_ID,
            1n
          )

        const purchaser3TR3XBalance = await tr3x.balanceOf(
          purchaser3.address,
          TR3X
        )

        expect(purchaser3TR3XBalance).to.equal(
          INITIAL_TR3X_BALANCE - EXCLUSIVE_LICENSE_PRICE
        )

        let exclusiveLicenseCreatorTR3XBalance = await tr3x.balanceOf(
          exclusiveLicenseCreator.address,
          TR3X
        )

        expect(exclusiveLicenseCreatorTR3XBalance).to.equal(
          INITIAL_TR3X_BALANCE + EXCLUSIVE_LICENSE_PRICE
        )

        const purchaser3ExclusiveLicenseTokenBalance = await tr3x.balanceOf(
          purchaser3.address,
          EXCLUSIVE_LICENSE_ID
        )

        expect(purchaser3ExclusiveLicenseTokenBalance).to.equal(1n)
      })

      it("should list tokens held by given address - also incl. an exclusive", async () => {
        const licensesHeldByPurchaser3 = await tr3x.licensesHeldBy(
          purchaser3.address
        )

        expect(licensesHeldByPurchaser3).to.deep.equal([
          [
            EXCLUSIVE_LICENSE_METADATA_CID,
            ethers.BigNumber.from(EXCLUSIVE_LICENSE_ID)
          ]
        ])
      })

      it("should fail if the exclusive has already been purchased", async () => {
        const licensePurchase = tr3x
          .connect(purchaser1)
          .purchase(EXCLUSIVE_LICENSE_ID, EXCLUSIVE_LICENSE_PRICE)

        await expect(licensePurchase).to.be.revertedWith("already acquired")
      })

      it("should not list an acquired exclusive under current offers", async () => {
        const offers = await tr3x.currentOffers()

        expect(offers).to.deep.equal([
          [LEASE_LICENSE_METADATA_CID, ethers.BigNumber.from(LEASE_LICENSE_ID)]
        ])
      })
    })
  })

  describe("license deactivation", () => {
    // NOTE: de/reactivation of leases/exclusives is absolutely identical..
    // ...thus we test with a lease only
    it("it should fail for non-creators", async () => {
      const licenseDeactivation = tr3x
        .connect(purchaser1)
        .disable(LEASE_LICENSE_ID)

      await expect(licenseDeactivation).to.be.revertedWith(
        "creator only access"
      )
    })

    it("it should allow creators to deactivate license offers", async () => {
      const licenseDeactivation = tr3x.connect(lessor).disable(LEASE_LICENSE_ID)

      await expect(licenseDeactivation)
        .to.emit(tr3x, "Purchasability")
        .withArgs(LEASE_LICENSE_ID, false)

      const disabled = await tr3x.disabled(LEASE_LICENSE_ID)

      expect(disabled).to.be.true
    })

    it("should disallow purchasing deactivated license tokens", async () => {
      const licensePurchase = tr3x
        .connect(purchaser3)
        .purchase(LEASE_LICENSE_ID, LEASE_LICENSE_PRICE)

      await expect(licensePurchase).to.be.revertedWith("disabled offering")
    })

    it("should not list deactivated license token under offers", async () => {
      const offers = await tr3x.currentOffers()

      expect(offers).to.deep.equal([])
    })
  })

  describe("license reactivation", () => {
    it("it should fail for non-creators", async () => {
      const licenseDeactivation = tr3x
        .connect(purchaser1)
        .enable(LEASE_LICENSE_ID)

      await expect(licenseDeactivation).to.be.revertedWith(
        "creator only access"
      )
    })

    it("it should allow creators to reactivate license offers", async () => {
      const licenseReactivation = tr3x.connect(lessor).enable(LEASE_LICENSE_ID)

      await expect(licenseReactivation)
        .to.emit(tr3x, "Purchasability")
        .withArgs(LEASE_LICENSE_ID, true)
    })

    it("should allow purchasing reactivated license tokens", async () => {
      // kickin off a license purchase as purchaser3
      const licensePurchase = tr3x
        .connect(purchaser3)
        .purchase(LEASE_LICENSE_ID, LEASE_LICENSE_PRICE)

      // awaitin license creation
      await expect(licensePurchase)
        // TransferSingle event for the TR3X payment
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          tr3x.address,
          purchaser3.address,
          lessor.address,
          TR3X,
          LEASE_LICENSE_PRICE
        )
        // TransferSingle event for the license token transfer
        .to.emit(tr3x, "TransferSingle")
        .withArgs(
          tr3x.address,
          ZERO_ADDRESS,
          purchaser3.address,
          LEASE_LICENSE_ID,
          1n
        )
    })

    it("should list a reactivated license token under current offers", async () => {
      const offers = await tr3x.currentOffers()

      expect(offers).to.deep.equal([
        [LEASE_LICENSE_METADATA_CID, ethers.BigNumber.from(LEASE_LICENSE_ID)]
      ])
    })
  })
})
