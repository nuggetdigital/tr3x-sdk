#!/bin/bash

here_dir=$(dirname ${BASH_SOURCE[0]})

solc $here_dir/tr3x.sol -o $here_dir/bin --bin --abi --optimize --optimize-runs 419 "$@"

bytecode=$(<$here_dir/bin/ERC1155Tr3x.bin)

if ! node -e "require('web3')" > /dev/null 2>&1; then
  npm i --no-save web3
fi

node -e "
  const Web3 = require('web3')

  async function main() {
    const genesis = {
      privateKey: '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342',
      address: '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b'
    }

    const web3 = new Web3('http://localhost:19420')

    const balance = await web3.eth.getBalance(genesis.address)

    console.log('balance', balance)

    const tx = await web3.eth.accounts.signTransaction(
      {
          from: genesis.address,
          gas: '0x4C4B40',
          data: '$bytecode'
      },
      genesis.privateKey
    )

    const rcpt = await web3.eth.sendSignedTransaction(tx.rawTransaction)

    console.log('contract deployed at address', rcpt.contractAddress)
  }

  main()
"