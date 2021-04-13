// ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

module.exports = {
  // latest Solidity version
  solidity: "0.8.3",

  networks: {
    // Moonbase Alpha network specification
    moonbase: {
      url: `https://rpc.testnet.moonbeam.network`,
      chainId: 1287,
      // private key from the pre-funded Moonbase Alpha testing account
      accounts: [require('./secrets.json').privateKey]
    }
  }
};