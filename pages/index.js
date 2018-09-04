import React from 'react';
import factory from '../ethereum/factory';

class CampaignIndex extends Component {
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
}

export default CampaignIndex;