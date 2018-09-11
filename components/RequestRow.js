import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign.js';

class RequestRow extends React.Component {

  onApprove = async() => {

    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);
    campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
  }

  onFinalize = async() => {
    
    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);
   
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });

  }

  onDeny = async() => {

    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);

    await campaign.methods.denyRequest(this.props.id).send({
      from: accounts[0]
    });

  }

  onFinalizeDenial = async() => {

    const accounts = await web3.eth.getAccounts();

    const campaign = Campaign(this.props.address);

    await campaign.methods.finalizeDenial(this.props.id).send({
      from: accounts[0]
    });

  }

  render() {

    const { request, id, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <tr disabled = {request.complete} positive = {readyToFinalize && !request.complete}>
        <td>{id}</td>
        <td>{request.description}</td>
        <td>{web3.utils.fromWei(request.value, 'ether')}</td>
        <td>{request.recipient}</td>
        <td>{request.approvalCount}/{approversCount}</td>
        <td>{request.disapprovalCount}/{approversCount}</td>
        <td>
          { request.complete || request.denied ? null: (
          <Button color = 'green' basic onClick = {this.onApprove}>Approve</Button>
          )}
        </td>
        <td>
          { request.complete || request.denied ? null: (
          <Button color = 'teal' basic onClick = {this.onFinalize}>Finalize</Button>
          )}
        </td>
        <td>
          { request.complete || request.denied ? null: (
          <Button color = 'orange' basic onClick = {this.onDeny}>Deny</Button>
          )}
        </td>
        <td>
          { request.complete || request.denied ? null: (
          <Button color = 'red' basic onClick = {this.onFinalizeDenial}>Finalize Denial</Button>
          )}
        </td>
      </tr>
    );
  }
}

export default RequestRow;