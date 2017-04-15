import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '../imports/ui/App.jsx';
import '../imports/startup/accounts-config.js';

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/register', {
  name: 'register',
  template: 'register'
});
Router.route('/login', {
  name: 'login',
  template: 'login'
});

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        });
        Router.go('home');
    }
});

// submit event for login template in main.html
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
    }
});

// logout event handler
Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});