// scripts/deploy.js
async function main() {
    // We get the contract to deploy
    const ERC1155Tr3x = await ethers.getContractFactory('ERC1155Tr3x');
    console.log('Deploying ERC1155Tr3x...');
 
    // Instantiating a new ERC1155Tr3x smart contract
    const tr3x = await ERC1155Tr3x.deploy();
 
    // Waiting for the deployment to resolve
    await tr3x.deployed();
    console.log('ERC1155Tr3x deployed to:', tr3x.address);
 }
 
 main()
    .then(() => process.exit(0))
    .catch((error) => {
       console.error(error);
       process.exit(1);
    });