import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Grid } from 'react-bootstrap';
import StockInput from '../../ui/components/StockInput.js';
import StockButtonList from '../../ui/components/StockButtonList.js';
import Index from '../../ui/pages/Index.js';

Meteor.startup(() => {
  render(
    <div>
      <StockInput />
      <StockButtonList companyCode="AAPL" companyName="Apple" />
      <Grid>
        <Index />
      </Grid>
    </div>,
  document.getElementById('react-root'));
});
