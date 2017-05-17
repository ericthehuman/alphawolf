// import '/imports/startup/server';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import '../imports/api/data.js';
import { Data, Stocks, SelectedStock, ActiveStocks, News } from '../imports/api/data.js';
import { ReactiveVar } from 'meteor/reactive-var';

//stuff happening on the server side ...

Meteor.startup(() => {
    ActiveStocks.remove({});
    Stocks.remove({});

    Meteor.call('get300Companies', function(error, result) {
      if (result) {
        var res = JSON.parse(result.content);
        for (var i = 0; i < res.query.results.row.length; i++) {
          var code = res.query.results.row[i].code;
          var name = res.query.results.row[i].name;
          var sector = res.query.results.row[i].sector;
          var market_cap = res.query.results.row[i].market_cap;
          var weight_percent = res.query.results.row[i].weight_percent;
          Stocks.insert({name: name, code: code, sector: sector, market_cap: market_cap, weight_percent: weight_percent});
        }
      } else {
        console.log(error);
        console.log("Error from GET300COMPANIES");
      }
    })

    Meteor.call('getData', "CBA.AX", function(error, result) {
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var companyData = res.CompanyReturns[0].Data;
          var stockToUpdate = Stocks.findOne({name: "Commonwealth Bank of Australia"});
          // console.log(stockToUpdate);
          Stocks.update(stockToUpdate, {
            name: stockToUpdate.name,
            code: stockToUpdate.code,
            sector: stockToUpdate.sector,
            market_cap: stockToUpdate.market_cap,
            weight_percent: stockToUpdate.weight_percent,
            data: companyData,
          });
          ActiveStocks.insert({name: "Commonwealth Bank of Australia", code: "CBA", new: false});
          console.log("Stock added");
        } else {
          console.log(res.Log.ErrorMessage);
        }
      } else {
        console.log(error);
        console.log("Error from GETDATA");
      }
    });

    Meteor.call('getData', "ABP.AX", function(error, result) {
    	// console.log("get data");
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var companyData = res.CompanyReturns[0].Data;
          var stockToUpdate = Stocks.findOne({code: "ABP"});
          // console.log(stockToUpdate);
          Stocks.update(stockToUpdate, {
            name: stockToUpdate.name,
            code: stockToUpdate.code,
            sector: stockToUpdate.sector,
            market_cap: stockToUpdate.market_cap,
            weight_percent: stockToUpdate.weight_percent,
            data: companyData,
          });
          ActiveStocks.insert({name: stockToUpdate.name, code: stockToUpdate.code, new: false});
          // console.log("Stock added");
        }
      } else {
        console.log(error);
        console.log("Error from GETDATA");
      }
    });

    Meteor.call('getData', "BHP.AX", function(error, result) {
    	// console.log("get data");
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var companyData = res.CompanyReturns[0].Data;
          var stockToUpdate = Stocks.findOne({code: "BHP"});
          // console.log(stockToUpdate);
          Stocks.update(stockToUpdate, {
            name: stockToUpdate.name,
            code: stockToUpdate.code,
            sector: stockToUpdate.sector,
            market_cap: stockToUpdate.market_cap,
            weight_percent: stockToUpdate.weight_percent,
            data: companyData,
          });
          ActiveStocks.insert({name: stockToUpdate.name, code: stockToUpdate.code, new: false});
          // console.log("Stock added");
        }
      } else {
        console.log(error);
        console.log("Error from GETDATA");
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

    	// console.log(dateString);

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
	},

  // Get list of top 300 ASX companies
  'get300Companies': function() {
    this.unblock();
		return HTTP.call('GET', "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fwww.asx300list.com%2Fwp-content%2Fuploads%2Fcsv%2F20170501-asx300.csv'%20and%20columns%3D'code%2Cname%2Csector%2Cmarket_cap%2Cweight_percent%2Ccol1%2Ctotal_market_cap%2Ccol2'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys");
  },

  'getASXCompanyInfo': function(stockCode) {
    this.unblock();
    return HTTP.call('GET', 'http://data.asx.com.au/data/1/company/' + stockCode);
  },

  'getASXDividends': function(stockCode) {
    this.unblock();
    return HTTP.call('GET', 'http://data.asx.com.au/data/1/company/' + stockCode + '/dividends/history');
  },

  'getASXAnnouncements': function(stockCode, endDate) {
    this.unblock();
    return HTTP.call('GET', 'http://data.asx.com.au/data/1/company/' + stockCode + '/announcements?market_sensitive=true&count=20&before_time=' + end_date);
  },

  'getGuardianNews': function(section, beginDate, endDate, x, queryString) {
    this.unblock();
    return HTTP.call('GET', 'http://content.guardianapis.com/search?'
    + 'section=' + section
    + 'from-date=' + beginDate
    + '&to-date=' + endDate
    + '&page-size=' + x // retrieve x articles
    + '&q=' + queryString
    + '&api-key=59ce1afb-ea95-4ab7-971e-dc59c7189718');
  }
});
