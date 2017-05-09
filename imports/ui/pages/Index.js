import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import Chart from '../../ui/App.jsx';


const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
    <div align="right">
      <h3>stock name</h3>
      <h3>stock value today</h3>
    </div>
      <h3> Insert stock name</h3>
       <canvas id="stockchart" width="300" height="300"></canvas>
    </Jumbotron>
    <Chart />
  </div>
);

export default Index;
