import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';

const AppNavigation = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        Cubs of Wall St
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
    </Navbar.Collapse>
  </Navbar>
);

export default AppNavigation;
