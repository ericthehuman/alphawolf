import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies, Stocks, SelectedStock, News } from '../../api/data.js';
import Tile from './Tile.jsx';
import Button from './Button.jsx';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { ReactiveVar } from 'meteor/reactive-var';
import { Button as BSButton, Form, FormControl, FormGroup, Nav, NavItem, Navbar  } from 'react-bootstrap';
import moment from 'moment';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';




// App component - represents the whole app
class App extends Component {

constructor(props){
  super(props);
  this.handleOptionChange = this.handleOptionChange.bind(this);
  this.addStock = this.addStock.bind(this);
  this.state = {
    submitted: false,
    selectMultiple: false
  };
  this.newsData = function () {
      return Session.get('newsData');
  }
  this.sectionNewsData = function () {
      return Session.get('sectionNewsData');
  }
  this.companyData = function() {
      return Session.get('companyData');
  }
}

// parseDataIntoGraph(result){
//   var array = result.content.data.CompanyReturns.Data;
//   var data = [];
//   var i = 0;
//   while(i < array.length()){
//     data.push({
//       name: i-100,
//       value: array[i].Closing
//     });
//     i = i +1;
//   }
//
//   return data;
//
// }

renderTile() {

  // console.log("Code to pass: " + this.props.selectedStocks.code);
  // console.log("Name to pass: " + this.props.selectedStocks.name);
  if(this.props.selectedStocks.code == "Home"){
    return (
      <div>
        <Tile stockData={this.props.selectedStocks} display={"Home"} />
      </div>
    );
  }else{
    return (
      <div>
        <Tile stockData={this.props.selectedStocks} newsData={this.props.newsData}/>
      </div>
    );
  }

}

handleOptionChange(companiesList) {
    if (stockCode != "Home") {

        // Unnecessary stuff just here for the stockCode to be used for the news right now
        for (var i = 0; i < companiesList.length; i++) {
            var stockName = companiesList[i];
            // console.log("Current company name: " + stockName);
            var codeRegex = /\((.*)\)$/;
            var stockCode = codeRegex.exec(stockName)[1];
            stockName = stockName.replace(/\s\(.*\)$/, "");
            // console.log("Regexed company code: " + stockCode);
            // console.log("Regexed company name: " + stockName);
        }

        var stocksToShow = Stocks.find({name: {$in: companiesList}}).fetch();
        var dataArray = [];
        for (var i = 0; i < stocksToShow.length; i++) {
            var stockName = stocksToShow[i].name;
            stockName = stockName.replace(/\s\(.*\)$/, "");
            var data = {
                code: stocksToShow[i].code,
                name: stockName,
                data: stocksToShow[i].data
            };

            dataArray.push(data);
        }
        SelectedStock.set(dataArray);

        // retrieve company information from ASX -> fail -> 2. Intrinio
        var begin_date = "2016-12-28";
        var end_date = "2017-04-07";
        callCompanyInfo(stockCode, end_date, function (result) {
            // assume there is function to retrieve dates
            // var begin_date = moment().subtract(365, 'days').format('YYYYMMDD');
            // var end_date = moment().format('YYYYMMDD');
            // console.log("Begin: " + begin_date + " | End: " + end_date);

            // The Guardian date must be in format YYYY-MM-DD
            // NYT dates must be in format YYYYMMDD
            // switch number of articles returned by specifying 2nd param in this call
            callGuardianAPI(stockName, 100, begin_date, end_date, 'newsData');
            callGuardianAPI(result.sector, 100, begin_date, end_date, 'sectionNewsData');

        });

    } else {
        console.log("Home");
        SelectedStock.set([{
            code: "Home",
            data: "",
        }])
    }

    function callCompanyInfo(stockCode, end_date, callback) {
        callASXCompanyInfo(stockCode, end_date, function(result) {
            if (result == null) {

            } else {
                console.log(result);
                callback(result);
            }
        });
    }

    // calls ASX API to get company information from AUSTRALIAN stockCode (without .AX)
    function callASXCompanyInfo(stockCode, end_date, callback) {
        console.log("calling ASX API...");
        HTTP.call('GET',
            'http://data.asx.com.au/data/1/company/' + stockCode, function(error, result) {
                if (error) {
                    console.log("ASX did not find " + stockCode);
                    callIntrinioCompanyInfo(stockCode, callback);

                } else if (result) {
                    var companyData = [];

                    var company = JSON.parse(result.content);
                    console.log(company);

                    companyData["dividends"] = [];
                    callASXAnnualDividends(stockCode, function(dividends) {
                        callASXAnnouncements(stockCode, end_date, function(announcements) {
                            companyData["announcements"] = announcements;
                            companyData["dividends"] = result;
                            companyData["name"] = company.name_full;
                            companyData["short_description"] = company.principal_activities;
                            companyData["ceo"] = "";
                            companyData["url"] = company.web_address;
                            companyData["address"] = company.mailing_address;
                            companyData["logo_img_url"] = company.logo_image_url;
                            companyData["phone"] = company.phone_number;
                            companyData["mailing_address"] = company.mailing_address;
                            companyData["phone_number"] = company.phone_number;
                            companyData["sector"] = company.sector_name;
                            companyData["announcements"] = announcements;

                            Session.set('companyData', companyData);
                            callback(companyData);
                        });
                    });
                }
            });
    }

    function callASXAnnualDividends(stockCode, callback) {
        console.log("Calling ASX dividends info...");
        HTTP.call('GET',
            'http://data.asx.com.au/data/1/company/' + stockCode + '/dividends/history', function(error, result) {
                if (error) {
                    console.log("ASX did not find dividends for " + stockCode);
                    callback(null);
                } else if (result) {
                    var raw = JSON.parse(result.content);
                    console.log(raw);

                    var dividends = [];
                    for (var i = 0; i < raw.length; i++) {
                        var dividend_date = Date(raw[i].year, 12, 31);
                        var dividend_amount = raw[i].amount;
                        dividends.push({
                            date: dividend_date,
                            amount: dividend_amount
                        });
                    }
                    callback(dividends);
                }
            });
    }

    // maximum market sensitive announcements this API can call at a time is 20
    function callASXAnnouncements(stockCode, end_date, callback) {
        console.log("Calling ASX dividends info...");
        return HTTP.call('GET',
            'http://data.asx.com.au/data/1/company/' + stockCode + '/announcements?market_sensitive=true&count=20&before_time=' + end_date, function(error, result) {
                if (error) {
                    console.log("ASX did not find announcements for " + stockCode);
                    callback(null);
                    return;
                }

                if (result) {
                    var raw = JSON.parse(result.content);
                    console.log(raw);

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
                    callback(announcements);
                    return;
                }
            });
    }

    // calls USA API to get USA company information (fallback from ASX not containing code)
    function callIntrinioCompanyInfo(stockCode, callback) {
        console.log("calling Intrinio API...");
        HTTP.call('GET', 'https://api.intrinio.com/companies?', {
            headers: {
                // Authorization: "Basic $BASE64_ENCODED(a6d9f89537dd393dff3caf7d6982efb1:e827c3b2db95358452d09c6e8512a2de)"
                // manually converting the API_KEY:API_PASSWORD into base64 because meteor is shite and this took fucking hours
                Authorization: "Basic YTZkOWY4OTUzN2RkMzkzZGZmM2NhZjdkNjk4MmVmYjE6ZTgyN2MzYjJkYjk1MzU4NDUyZDA5YzZlODUxMmEyZGU="
            },
            // auth : "YTZkOWY4OTUzN2RkMzkzZGZmM2NhZjdkNjk4MmVmYjE=:ZTgyN2MzYjJkYjk1MzU4NDUyZDA5YzZlODUxMmEyZGU=",
            params: {
                identifier: stockCode,
                // query: {query-string} // optional
            }
        }, function (error, result) {
            if (error) {
                console.log("Shites not working");
                callback(null);

            } else if (result) {
                var company = JSON.parse(result.content);
                console.log(company);

                var companyData = [];
                companyData["name"] = company.name;
                companyData["short_description"] = company.short_description;
                companyData["ceo"] = company.ceo;
                companyData["url"] = company.company_url;
                companyData["address"] = company.business_address;
                companyData["logo_img_url"] = "";
                companyData["phone_number"] = company.business_phone_no;
                companyData["mailing_address"] = company.business_address;
                companyData["sector"] = company.sector;

                Session.set('companyData', companyData);
                callback(companyData);
            }
        });
    }

    // guardian API call to get x num of articles between certain dates (but hard cap at 100; change below if needed)
    function callGuardianAPI(queryTopic, x, begin_date, end_date, sessionKeyword) {
        console.log("callGuarddianAPI " + queryTopic + " " + x + " " + begin_date + " " + end_date);
        if (sessionKeyword === "sectionNewsData") {
            queryTopic += "%20major%20news";
        }

        HTTP.call('GET',
            'http://content.guardianapis.com/search?'
            + 'from-date=' + begin_date
            + '&to-date=' + end_date
            + '&page-size=' + x // retrieve x articles
            + '&q=' + queryTopic
            + '&api-key=' + 'test', //'59ce1afb-ea95-4ab7-971e-dc59c7189718', //'test'
            function (error, result) {
                if (error) {
                    console.log(error);
                    return null;
                } else {

                    var newsArray = [];
                    var sectionId = []; // to determine company's main sector
                    sectionId["maxNum"] = 0;
                    sectionId["name"] = "";

                    var parsedResult = JSON.parse(result.content);
                    var length = Math.min(100, parsedResult.response.results.length); // hard cap set here

                    for (var i = 0; i < length; i++) {
                        var article = parsedResult.response.results[i];
                        newsArray[i] = article;
                        newsArray[i]['headline'] = (article.webTitle === undefined) ? "" : article.webTitle;
                        newsArray[i]['url'] = article.webUrl;
                        newsArray[i]['source'] = "The Guardian UK"; // name of news source i.e. Guardian UK
                        // publication date in YYYY-MM-DD'T'HH:MM:SS'Z' -> DD/MM/YYYY
                        newsArray[i]['date'] = article.webPublicationDate.substring(8, 10) + "/" + article.webPublicationDate.substring(5, 7) + "/" + article.webPublicationDate.substring(0, 4);
                        // newsArray[i]['pic'] = (article.multimedia.length != 0) ? "http://www.nytimes.com" + article.multimedia["0"].url : "no pic"; // icons/pics only exist in NYT
                        // newsArray[i]['abstract'] = (article.snippet !== undefined) ? article.snippet : article.lead_paragraph; // snippets only exist in NYT
                    }

                    console.log(newsArray);
                    Session.set(sessionKeyword, newsArray);
                    News.set([{
                        code: "News",
                        data: newsArray,
                    }])
                }
            });
    };

}
handleStockScope (event){

}

renderStocks() {
  return this.props.stocks.map((stock) => (
    <Button key={stock._id} stock={stock} optionChange={this.handleOptionChange.bind(this)} />
    ));
}

// New submit
addStock() {
  var newCompanies = JSON.parse(this.refs.inputVal.value);
  for (var i = 0; i < newCompanies.length; i++) {
    var codeRegex = /\((.*)\)$/;
    var companyName = newCompanies[i];
    var companyCode = codeRegex.exec(companyName)[1];
    console.log("Curr company: " + companyCode);
    // companyName = companyName.replace(/\s\(.*\)$/, "");
    // console.log("Regexed company name: " + companyName);
    Meteor.call('getData', companyCode, function(error, result) {
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var companyData = res.CompanyReturns[0].Data;

          Stocks.insert({
            name: companyName,
            code: companyCode,
            new: true,
            data: companyData
          });
          console.log("Stock added");
        } else {
          console.log(res.Log.ErrorMessage);
        }
      } else {
        console.log(error);
      }
    });
  }

  this.forceUpdate();
}

//we can populate the radio button selection with a function later

  render() {
    // console.log("App rendered");
    // console.log(SelectedStock.get().code)
    // console.log(SelectedStock.get().news)
    return (
      <div>
        <div>
          <Navbar fixedTop className="navbar-custom">
            <Navbar.Header>
              <Navbar.Brand>
                <span id="title">cubs of wall street</span>
              </Navbar.Brand>
            </Navbar.Header>
            <Navbar.Form inline id="stockInputForm">
              <input id="magicsuggest"/>
              {' '}
              <BSButton bsStyle="success" onClick={ this.addStock } id="addBtn">Add</BSButton>
              <input type="hidden" ref="inputVal" id="inputVal"/>
            </Navbar.Form>
            <CheckboxGroup onChange={ this.handleOptionChange }>
              {this.renderStocks()}
            </CheckboxGroup>
          </Navbar>
        </div>
        <div className="container-fluid main-container">
{/*
        <form>
          <input type="text" ref="textInput" className="searchBar" placeholder="Search for a company or keyword"/>
        </form>


        <form onSubmit={this.handleSubmit.bind(this)}>
          <input id="submit" type="submit"/>
          <label className="label-for-submit" htmlFor="submit">Add stock</label>
        </form>
*/}
          <div className="tile-container">
           {this.renderTile()}
          </div>

{/*

            <div className="radio">

                <input type="radio" id="AAPL" value="AAPL" onChange={this.handleOptionChange}
                             name="choice" className="radio-with-label" />
                <label className="label-for-radio button" htmlFor="AAPL"> &nbsp; xxx  &nbsp;</label>
            </div>

            <div className="radio">



                <input type="radio" id="MSFT" value="MSFT" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label" />
                             <label className="label-for-radio button" htmlFor="MSFT"> &nbsp; yyy  &nbsp;</label>
            </div>
            <div className="radio">
                <input type="radio" id="BBRY" value="BBRY" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label"  />
                             <label className="label-for-radio button" htmlFor="BBRY"> &nbsp; zzz  &nbsp;</label>

            </div>
          </form>


*/}



{/*

           <Tile someData={this.renderData()}/>

      <LineChart width={600} height={300} data={graphData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
*/}
        </div>
      </div>
    );
  }
}


App.propTypes = {
  ddata: PropTypes.array.isRequired,
  comps: PropTypes.array.isRequired,
  stocks: PropTypes.array.isRequired,
  selectedStocks: PropTypes.array,
  newsData: PropTypes.array,
};

export default createContainer(() => {
  return {
    ddata: Data.find({}).fetch(),
    comps: Companies.find({}).fetch(),
    stocks: Stocks.find({}).fetch(),
    selectedStocks: SelectedStock.get(),
    newsData: News.get(),
  };
}, App);
