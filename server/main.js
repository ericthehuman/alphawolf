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
    Stocks.insert({name: "Home", code: "HOME", data:""})
    Stocks.insert({name: "Apple Inc.", code: "AAPL", data: ""});
    Stocks.insert({name: "Microsoft Corporation", code: "MSFT", data: ""});
    Stocks.insert({name: "BlackBerry Limited", code: "BBRY", data: ""})

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
		return HTTP.call('GET', 'https://alphawolfwolf.herokuapp.com/api/finance?list_of_var=CM_Return,AV_Return', {
			params: {
				instrumentID: id,
				upper_window: 0,
				lower_window: 365,
				dateOfInterest: dateString,
			}
		});
	}
});
