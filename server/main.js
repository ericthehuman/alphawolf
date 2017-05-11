// import '/imports/startup/server';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import '../imports/api/data.js';
import { Data, Stocks, SelectedStock } from '../imports/api/data.js';
import { ReactiveVar } from 'meteor/reactive-var';

//stuff happening on the server side ...

Meteor.startup(() => {
    Stocks.remove({});
    Stocks.insert({name: "Home", code: "Home", data:"", new: false})

    Meteor.call('getData', "AAPL", function(error, result) {
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var companyData = res.CompanyReturns[0].Data;
          Stocks.insert({name: "Apple Inc. (AAPL)", code: "AAPL", data: companyData, new: false});
          // console.log("Stock added");
        }
      } else {
        console.log(error);
      }
    });

});

Meteor.methods({
	//this function should put a http response into the server
	'getData': function(id) {
	    var dateOfMonth = new Date().getDate();
	    var month = new Date().getMonth() + 1;
	    var year = new Date().getFullYear();
	    var dateString = dateOfMonth + "/" + month + "/" + year;

    	console.log(dateString);

		this.unblock();
		return HTTP.call('GET', 'https://alphawolfwolf.herokuapp.com/api/finance?', {
			params: {
				instrumentID: id,
				upper_window: 0,
				lower_window: 365,
				dateOfInterest: dateString,
			}
		});
	},

	//get data summary from wikipedia
	'getSummary': function(name){
		this.unblock();
		return HTTP.call('GET', 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=', {
				params: {
					titles: name
				}
		});
	}
});
