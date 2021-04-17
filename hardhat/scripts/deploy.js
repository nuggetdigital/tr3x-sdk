// scripts/deploy.js
async function main() {
  // We get the contract to deploy
  const Tr3x = await ethers.getContractFactory("Tr3x")
  console.log("Deploying Tr3x...")

  // Instantiating a new Tr3x smart contract
  const tr3x = await Tr3x.deploy()

  // Waiting for the deployment to resolve
  await tr3x.deployed()
  console.log("Tr3x deployed to:", tr3x.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
