import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
//import address from '../address.js'

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x35616B86432d9439D587dAB00043d56d219fac91'
);

export default instance;
