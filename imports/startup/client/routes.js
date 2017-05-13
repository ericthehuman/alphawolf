import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/components/App.jsx';

var Highcharts = require('highcharts/highstock');


Meteor.startup(() => {
  render(
    <App />,
  document.getElementById('react-root'));
});

Template.body.events({
    'click #testButton': function (e) {
        e.preventDefault();
        console.log("UPDATE GRAPH BUTTON PRESSED");

        // this doesn't work zzz
        // var extraOptions = { // new data set for graph
        //     type: 'flags',
        //     name: "Test Pin",
        //     color: '#333333',
        //     shape: 'squarepin',
        //     data: [{
        //         x: Date.UTC(2017, 1, 1),
        //         y: 0,
        //         text: "TESTING INSERTION",
        //         title: "Test",
        //         shape: 'squarepin'
        //     }],
        //     showInLegend: true
        // };
        // var charts = Highcharts.charts;
        // console.log(charts);
        // var chart = charts[0];
        // console.log(chart);
        // console.log(chart.series);
        // var series = chart.series[0];
        // console.log(series);
        // Meteor.call(Highcharts.charts[0]).series[0].setData(extraOptions, true);
    }
});
