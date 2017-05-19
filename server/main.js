// import '/imports/startup/server';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import '../imports/api/data.js';
import { Data, Stocks, SelectedStock, News } from '../imports/api/data.js';
import { ReactiveVar } from 'meteor/reactive-var';

//stuff happening on the server side ...

Meteor.startup(() => {
    Stocks.remove({});
    Stocks.insert({name: "Home", code: "Home", data:"", new: false})

    Meteor.call('getData', "AAPL", function(error, result) {
    	console.log("get data");
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
    Meteor.call('getNews', "AAPL", function(error, result) {
    	console.log("get news react");
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var companyData = res.CompanyReturns[0].Data;
          //Stocks.insert({name: "Apple Inc. (AAPL)", code: "AAPL", data: companyData, new: false});
          // console.log("Stock added");
        }
      } else {
        console.log(error);
      }
    });
});

Meteor.methods({
	'getNews': function(id) {
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
	//this function should put a http response into the server
	'getData': function(id) {
	    var dateOfMonth = new Date().getDate();
	    var month = new Date().getMonth() + 1;
	    var year = new Date().getFullYear();
	    var dateString = dateOfMonth + "/" + month + "/" + year;

    	console.log(dateString);
		this.unblock();
		return HTTP.call('GET', 'https://alphawolfwolf.herokuapp.com/api/finance2?', {
			params: {
				instrumentID: "RIO",
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
	},

	//get company data from intrino, this function ain't connecting and i can't figure out why zz
	'retrieveCompanyData': function (stockCode) {
        this.unblock();
        console.log("CALLING retrieveCompanyData " + stockCode);
        return HTTP.call('GET', 'https://api.intrinio.com/companies?', {
            headers: {
                Authorization: "a6d9f89537dd393dff3caf7d6982efb1:e827c3b2db95358452d09c6e8512a2de"
                // Authorization: "Basic $BASE64_ENCODED(a6d9f89537dd393dff3caf7d6982efb1:e827c3b2db95358452d09c6e8512a2de)"
            },
       		params: {
                identifier: stockCode,
				// query: {query-string} // optional
        	}
        });
	}
});
