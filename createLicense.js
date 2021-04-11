const Web3 = require('web3')

module.exports = function init(web3 = new Web3(process.env.MOONBEAM_RPC || 'http://localhost:19420')) {
  return function createLicense({ cid, price, isExclusive }, { address, privateKey }) {
    const tx = await web3.eth.accounts.signTransaction(
      {
          from: address,
          gas: '0x4C4B40', // TODO
          data: 'TODO'
      },
      privateKey
    )

    return web3.eth.sendSignedTransaction(tx.rawTransaction)
  }
}