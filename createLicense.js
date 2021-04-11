const Web3 = require("web3")
const ERC1155Tr3xAbi = require("./misc/bin/ERC1155Tr3x.abi")

module.exports = function init(
  web3 = new Web3(process.env.MOONBEAM_NODE_RPC || "http://localhost:19420")
) {
  return async function createLicense(
    { cid, price, isExclusive },
    { address, privateKey },
    contract = process.env.TR3X_CONTRACT_ADDRESS
  ) {
    const tx = await web3.eth.accounts.signTransaction(
      {
        from: address,
        to: contract,
        gas: "0x4C4B40",
        data: web3.eth.abi.encodeFunctionCall(ERC1155Tr3xAbi, [
          cid,
          price,
          isExclusive
        ])
      },
      privateKey
    )

    return web3.eth.sendSignedTransaction(tx.rawTransaction)
  }
}
