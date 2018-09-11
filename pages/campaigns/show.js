import React from 'react';
import Layout from '../../components/Layout.js';
import Campaign from '../../ethereum/campaign.js';
import ContributeForm from '../../components/ContributeForm.js'
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3.js';
import { Link } from '../../routes.js';
class CampaignShow extends React.Component {

  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return { 
      address: props.query.address,
      minimumContribution: summary[1],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }

  renderCards() {

    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word'}
      },
      {
        header: minimumContribution,
        meta: 'minimumContribution (wei)',
        description: 'You must contribute at least this much Wei to participate in the crowdfund.',
        style: { overflowWrap: 'break-word'}
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
        style: { overflowWrap: 'break-word'}
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have already donated to this campaign',
        style: { overflowWrap: 'break-word'}
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance',
        description: 'How much ETH individuals have donated to this campaign.',
        style: { overflowWrap: 'break-word'}
      }
    ];

    return < Card.Group items = {items} />

  }

  render() {
    return (
      <Layout>
        <h3>CampaignShow</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width = {10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width = {6}>
              <ContributeForm address = {this.props.address}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route = {`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;