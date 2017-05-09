import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Grid } from 'react-bootstrap';
import StockInput from '../../ui/components/StockInput.js';
import StockButtonList from '../../ui/components/StockButtonList.js';
import Index from '../../ui/pages/Index.js';
import App from '../../ui/components/App.jsx';

//main file is here
//<StockInput companies={[{companyCode: 'MSFT', companyName: 'Microsoft Corporation'}]}/>

Meteor.startup(() => {
  render(
    <App />,
  document.getElementById('react-root'));
});
