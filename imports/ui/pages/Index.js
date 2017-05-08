import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import Chart from '../../ui/App.jsx';

const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>Base</h2>
    </Jumbotron>
    <Chart />
  </div>
);

export default Index;
