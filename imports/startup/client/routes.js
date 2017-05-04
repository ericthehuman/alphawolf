import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Grid } from 'react-bootstrap';
import Index from '../../ui/pages/Index.js';
import AppNavigation from '../../ui/components/AppNavigation.js';
import { BrowserRouter, Route, browserHistory, IndexRoute } from 'react-router-dom';

Meteor.startup(() => {
  render(
    <div>
      <Grid>
        <Index />
      </Grid>
    </div>,
  document.getElementById('react-root'));
});
