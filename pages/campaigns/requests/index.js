import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes.js';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
class RequestIndex extends React.Component {

  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);

    const requestCount = await campaign.methods.getRequestsCount().call();

    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount)).fill().map((ele, index) => {
        return campaign.methods.requests(index).call();
      })
    )

    return { address, requests, requestCount, approversCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          id = {index}
          key = {index}
          request = {request}
          address = {this.props.address}
          approversCount = {this.props.approversCount}
          >
        </RequestRow>
      );
    })
  }

  render() {
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route = {`/campaigns/${this.props.address}/requests/new`}> 
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
        <table className = 'ui single line table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Recipient</th>
              <th>Approval Count</th>
              <th>Approve</th>
              <th>Finalize</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </Layout>
    );
  }
}

export default RequestIndex;