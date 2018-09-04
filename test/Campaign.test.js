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

  });

  it('requires a minimum contribution for a given campaign', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[2],
        value: web3.utils.toWei('0.9', 'ether'),
        gas: '1000000'
      });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.makeRequest("test request", web3.utils.toWei('1','ether'), accounts[1]).send({
      from: accounts[1],
      gas: '1000000'
    });
    const {description, value, recipient, complete, approvalCount} = await campaign.methods.requests(0).call();
    assert.equal(description, "test request");
    assert.equal(value, Web3.utils.toWei('1','ether'));
    assert.equal(recipient, accounts[1]);
    assert.equal(complete, false);
    assert.equal(approvalCount, 0);
  });

  it('processes requests', async () => {

    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('1.1','ether'),
      gas: '1000000'
    });

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei('1.1','ether'),
      gas: '1000000'
    });

    const requesterBalance = await web3.eth.getBalance(accounts[1]); 

    await campaign.methods.makeRequest("Test Request 2", web3.utils.toWei('2', 'ether'), accounts[1]).send({
      from: accounts[0],
      gas:'1000000'
    });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: '1000000'
    });

    try {
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: '1000000'
      });
      assert(false);
    } catch (err) {
      assert(true);
    }

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas:'1000000'
    });

    assert(await web3.eth.getBalance(accounts[1]) > requesterBalance);

  });

});