import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';
import { Head } from 'next/head';

export default (props) => {
  return (
    <Container> 
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.3.3/dist/semantic.min.css"></link>
      </head>
      <Header/>
      {props.children}
      <h1>I'm a footer</h1>
    </Container>
  );
};