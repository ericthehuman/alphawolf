import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import '../../api/data.js';
import { Data } from '../../api/data.js';

//stuff happening on the server side ...
Router.route('/register');

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
	},

	'getNews': function(query) {
		this.unblock();
		return HTTP.call('GET', 'https://api.nytimes.com/svc/search/v2/articlesearch.json', {
			params: {
				'api-key': '591e19bb7d974693b30e645f3288102d',
				q: query
			}
		});
	}
});
