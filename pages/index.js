import React from 'react';
import factory from '../ethereum/factory';

class CampaignIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: []
    }
  }
  async componentDidMount() {
    const campaigns = await factory.methods.returnAllCampaigns().call();
    this.setState({
      campaigns
    });
  }
  render() {
    return <h1>Heyhey you you</h1>
  }
}

export default CampaignIndex;