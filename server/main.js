import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import '../imports/api/data.js';
import { Data } from '../imports/api/data.js';

//stuff happening on the server side ... 

Meteor.startup(() => {
  // code to run on server at startup
    Data.update(1, {$set: {content: null}});

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