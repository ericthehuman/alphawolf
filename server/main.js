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
    Stocks.insert({name: "Apple", code: "AAPL", data: ""});
    Stocks.insert({name: "Microsoft", code: "MSFT", data: ""});
    Stocks.insert({name: "Blackberry", code: "BBRY", data: ""})


});

Meteor.methods({
	//this function should put a http response into the server
	'getData': function(id) {
		this.unblock();
		return HTTP.call('GET', 'https://alphawolfwolf.herokuapp.com/api/finance?list_of_var=CM_Return,AV_Return', {
			params: {
				instrumentID: id,
				upper_window: 0,
				lower_window: 100,
				dateOfInterest: "07/4/2017",
			}
		});
	}
});
