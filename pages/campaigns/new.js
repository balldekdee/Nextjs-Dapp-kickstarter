import React from 'react';
import Layout from '../../components/Layout.js'
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory.js';
import web3 from '../../ethereum/web3.js';
import { Router } from '../../routes.js'
class CampaignNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      minimumContribution: '',
      errorMessage:'',
      loading: false
    }
  }

  handleInputChange(e) {
    this.setState({
      minimumContribution: e.target.value
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({loading: true, errorMessage: ''});
    try {
      const accounts = await web3.eth.getAccounts();
      // Metamask auto estimates gas required
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });
      Router.pushRoute('/');
    } catch (err) {
      this.setState({
        errorMessage: err.message
      });
    }
    this.setState({loading: false});
  };

  render() {
    return ( 
      <Layout>
        <h3>Create A New Campaign</h3> 
        <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input label = "Wei" labelPosition = "right" onChange = {(e) => {this.handleInputChange(e)}} value = {this.state.minimumContribution}></Input>
          </Form.Field>
          <Message error header ="Oops!" content = {this.state.errorMessage} />
          <Button type = "submit" primary loading = {this.state.loading}>Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew