import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/components/App.jsx';


Meteor.startup(() => {
  render(
    <App />,
  document.getElementById('react-root'));
});
