import React from 'react';
import { Jumbotron } from 'react-bootstrap';

//where the graph should go
const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">

      <h2>Insert chart here...</h2>
      <h3> Insert stock name</h3>
       <canvas id="stockchart" width="300" height="300"></canvas>
    </Jumbotron>
  </div>
);

export default Index;
