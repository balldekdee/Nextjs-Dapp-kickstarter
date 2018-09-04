const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign(web3.utils.toWei('1','ether')).send({
    from: accounts[0],
    gas: '1000000'
  });

  // array destructuring with first element
  [campaignAddress] = await factory.methods.returnAllCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  
  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('enables users to donate money to a campaign and marks them as approvers', async () => {
    
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('1.1', 'ether'),
      gas: '1000000'
    });

    assert(campaign.methods.approvers(accounts[1]).call());

  })

})