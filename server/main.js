// import '/imports/startup/server';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import '../imports/api/data.js';
import { Data, Stocks, SelectedStock, ActiveStocks, News } from '../imports/api/data.js';
import { ReactiveVar } from 'meteor/reactive-var';
import moment from 'moment';

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

    var companyData = {};

    Meteor.call('getData', "CBA", function(error, result) {
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var stockData = res.CompanyReturns[0].Data;
          // console.log(stockToUpdate);
          companyData.stock_data = stockData;
          ActiveStocks.insert({name: "Commonwealth Bank of Australia", code: "CBA", new: false});
          console.log("Stock added");
        } else {
          console.log(res.Log.ErrorMessage);
          // If something goes wrong

          companyData.stock_data = [
            {
              "RelativeDate": -3,
              "Date": "14/07/2017",
              "Close": 0.2,
              "Return": 0,
              "CM_Return": 0.010189818707924127,
              "AV_Return": 0.0012737273384905159
            },
            {
              "RelativeDate": -2,
              "Date": "15/07/2017",
              "Close": 0.3,
              "Return": 0,
              "CM_Return": 0.010189818707924127,
              "AV_Return": 0.0012737273384905159
            },
            {
              "RelativeDate": -1,
              "Date": "16/07/2017",
              "Close": 0.4,
              "Return": 0,
              "CM_Return": 0.010189818707924127,
              "AV_Return": 0.0012737273384905159
            },
            {
              "RelativeDate": 0,
              "Date": "17/07/2017",
              "Close": 0.5,
              "Return": 0,
              "CM_Return": 0.010189818707924127,
              "AV_Return": 0.0012737273384905159
            },
          ]
          ActiveStocks.insert({name: "Commonwealth Bank of Australia", code: "CBA", new: false});
        }
      } else {
        console.log(error);
        console.log("Error from GETDATA");
      }
    });

    Meteor.call('getASXCompanyInfo', "CBA", function(error, result) {
      if (result) {
        var company = JSON.parse(result.content);
        companyData.name = company.name_full;
        companyData.short_description = company.principal_activities;
        companyData.ceo = "";
        companyData.url = company.web_address;
        companyData.address = company.mailing_address;
        companyData.logo_img_url = company.logo_image_url;
        companyData.phone = company.phone_number;
        companyData.mailing_address = company.mailing_address;
        companyData.phone_number = company.phone_number;
        companyData.sector = company.sector_name;
      }
    });

    Meteor.call('getASXDividends', "CBA", function(error, result) {
      if (result) {
        var raw = JSON.parse(result.content);
        var dividends = [];

        for (var i = 0; i < raw.length; i++) {
            var dividend_date = Date(raw[i].year, 12, 31);
            var dividend_amount = raw[i].amount;
            dividends.push({
                date: dividend_date,
                amount: dividend_amount
            });
        }
        companyData.dividends = dividends;
      }
    });
        Meteor.call('getASXAnnouncements', "CBA", "2017-05-17", function(error, result) {
      if (result) {
        var raw = JSON.parse(result.content);
        var announcements = [];

        for (var i = 0; i < raw.length; i++) {
            var date = Date(raw[i].document_date.substring(0, 4), raw[i].document_date.substring(5,7), raw[i].document_date.substring(8, 10));
            announcements.push({
                date: date,
                url: raw[i].url,
                title: raw[i].header,
                page_num: raw[i].number_of_pages,
                size: raw[i].size
            });
        }
        companyData.announcements = announcements;
      }
    });

    // Meteor.call('getGuardianNews', "australia-news", "2017-04-14", "2017-05-21", 20, "Commonwealth Bank of Australia AND finance", function(error, result) {
    //   if (result) {
    //     var newsArray = [];
    //     var sectionId = []; // to determine company's main sector
    //     // sectionId["maxNum"] = 0;
    //     // sectionId["name"] = "";
    //
    //     var parsedResult = JSON.parse(result.content);
    //     // console.log("parsedResult is: " + parsedResult);
    //     var length = Math.min(20, parsedResult.response.results.length); // hard cap set here
    //
    //     for (var i = 0; i < length; i++) {
    //         var article = parsedResult.response.results[i];
    //         if (article.type !== "article") continue;
    //
    //         // newsArray[i] = article;
    //         var newsData = {
    //           headline: (article.webTitle === undefined) ? "" : article.webTitle,
    //           url: article.webUrl,
    //           source: "The Guardian UK",
    //           // publication date in YYYY-MM-DD'T'HH:MM:SS'Z' -> DD/MM/YYYY
    //           date: article.webPublicationDate.substring(8, 10) + "/" + article.webPublicationDate.substring(5, 7) + "/" + article.webPublicationDate.substring(0, 4),
    //           section: article.sectionId
    //         }
    //
    //         newsArray.push(newsData);
    //     }
    //
    //     companyData.companyNews = newsArray;
    //   } else {
    //     console.log(error);
    //   }
    // });

    console.log("Updating");
    var stockToUpdate = Stocks.findOne({name: "Commonwealth Bank of Australia"});
    console.log("Logo: " + companyData.logo_img_url);
    Stocks.update(stockToUpdate, {
      name: stockToUpdate.name,
      code: stockToUpdate.code,
      sector: stockToUpdate.sector,
      market_cap: stockToUpdate.market_cap,
      weight_percent: stockToUpdate.weight_percent,
      stock_data: companyData.stock_data,
      short_description: companyData.short_description,
      url: companyData.url,
      address: companyData.address,
      logo_img_url: companyData.logo_img_url,
      phone: companyData.phone,
      dividends: companyData.dividends,
      announcements: companyData.announcements,
      companyNews: companyData.companyNews,
    });
});

Meteor.methods({
	'getData': function(id) {
    var dateString = moment().subtract(1, 'days').format('DD/MM/YYYY');

		this.unblock();
		return HTTP.call('GET', 'https://alphawolfwolf.herokuapp.com/api/finance2?', {
			params: {
				instrumentID: id,
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
    return HTTP.call('GET', 'http://data.asx.com.au/data/1/company/' + stockCode + '/announcements?market_sensitive=true&count=20&before_time=' + endDate);
  },

  // 'getGuardianNews': function(section, beginDate, endDate, x, queryString) {
  'getGuardianNews': function(queryString) {
    this.unblock();
    return HTTP.call('GET', 'http://content.guardianapis.com/search?'
    + 'section=' + 'australia-news' //section
    + '&from-date=' + '2010-01-01' //beginDate
    + '&to-date=' + '2017-12-30' //endDate
    + '&page-size=' + 100 //x // retrieve x articles
    + '&q=' + queryString
    + '&api-key=59ce1afb-ea95-4ab7-971e-dc59c7189718');
  }
});
