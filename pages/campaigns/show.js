import React from 'react';
import Layout from '../../components/Layout.js';

class CampaignShow extends React.Component {

  static async getInitialProps(props) {
    console.log(props.query.address);
    return {};
  }

  render() {
    return (
      <Layout>
        <h3>CampaignShow</h3>
      </Layout>
    );
  }
}

export default CampaignShow;