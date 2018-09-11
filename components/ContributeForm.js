import React from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '.././ethereum/web3.js';
import Campaign from '../ethereum/campaign.js';
import { Router } from '../routes';

class ContributeForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      errorMessage: '',
      loading: false
    }
  }

  onSubmit = async event => {

    event.preventDefault();
    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, '')
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch (err) {
      this.setState({ errorMessage: err} );
    }
    this.setState({loading: false, value: ''});
  }

  render() {
    return (
    <Form onSubmit = {(e) => this.onSubmit(e)} err = {!!this.state.errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input 
          onChange = {e => {this.setState({value: e.target.value})}}
          label = 'ether'
          labelPosition = 'right'>
        </Input>
      </Form.Field>
      <Message
        error
        header = 'Oops'
        content = {this.state.errorMessage}
      />
      <Button primary loading = {this.state.loading}>
        Contribute!
      </Button>
    </Form>
    );
  };
}

export default ContributeForm;

