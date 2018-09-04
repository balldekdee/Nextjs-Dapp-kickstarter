const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
require('dotenv').config();
const { interface, bytecode } = require('./compile.js');

const provider = new HDWalletProvider(
  process.env.mnemonic,
  'https://rinkeby.infura.io/v3/cff505b264bb479b9df907c80ee66f5f'
);

const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const results = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: '0x' + bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface);
  console.log('Contract deployed to ', result.options.address);

})