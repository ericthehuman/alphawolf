import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies, Stocks, ActiveStocks, SelectedStock, News } from '../../api/data.js';
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
    currSelectedStocks: [],
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

renderTile() {
  return (
    <div>
      <Tile stockData={this.props.selectedStocks} newsData={this.props.newsData}/>
    </div>
  );
}

// Reset the tile back to the home page
resetTile() {
  SelectedStock.set([{ code: "Home" }]);
  this.setState({ currSelectedStocks: [] });
}

handleOptionChange(companiesList) {
  if (companiesList.length > 2) {
    // Take the most recent stock only if more than 2 are selected
    companiesList = [companiesList[2]];
  }

  this.setState({ currSelectedStocks: companiesList });

  var stocksToShow = Stocks.find({name: { $in: companiesList } } ).fetch();
  var stockCode = stocksToShow[0].code;

  // console.log("stockCode is: " + stockCode);
  var dataArray = [];
  for (var i = 0; i < stocksToShow.length; i++) {
    var stockName = stocksToShow[i].name;
    console.log("Curr stock to show: " + stockName);
    // stockName = stockName.replace(/\s\(.*\)$/, "");
    var data = {
      code: stocksToShow[i].code,
      name: stockName,
      sector: stocksToShow[i].sector,
      market_cap: stocksToShow[i].market_cap,
      weight_percent: stocksToShow[i].weight_percent,
      data: stocksToShow[i].data
    };

    dataArray.push(data);
  }
  SelectedStock.set(dataArray);

}
handleStockScope (event){

}

renderStocks() {
  console.log(this.props.activeStocks);
  return this.props.activeStocks.map((stock) => (
    <Button key={stock._id} stock={stock} optionChange={this.handleOptionChange.bind(this)} />
    ));
}

// New submit
addStock() {
  var newCompanies = JSON.parse(this.refs.inputVal.value);
  console.log("Company name is: " + newCompanies[0]);
  for (var i = 0; i < newCompanies.length; i++) {
    var companyData = {};

    var companyCode = newCompanies[i].replace(/\.AX$/, "");
    var stockToUpdate = Stocks.findOne({code: companyCode});
    var companyName = stockToUpdate.name;

    console.log("Stock to update: " + stockToUpdate);
    Meteor.call('getData', newCompanies[i], function(error, result) {
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var stockData = res.CompanyReturns[0].Data;

          companyData.stock_data = stockData;

          companyCode = companyCode.replace(/\.AX$/, "");
          ActiveStocks.insert({name: companyName, code: companyCode, new: true});
          console.log("Stock added");
        } else {
          console.log(res.Log.ErrorMessage);
        }
      } else {
        console.log(error);
      }
    });

    // retrieve company information from ASX -> fail -> 2. Intrinio
    var begin_date = moment().subtract(365, 'days').format('YYYY-MM-DD');
    var end_date = moment().format('YYYY-MM-DD');
    callASXCompanyInfo(companyCode, end_date);
    var sector = stockToUpdate.sector.replace(/&/, "AND");
    callGuardianAPI(companyName, sector, 20, begin_date, end_date, 'newsData');
    callGuardianAPI(companyName, sector, 20, begin_date, end_date, 'sectionNewsData');

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
      sectionNewsData: companyData.sectionNewsData,
      otherNews: companyData.otherNews,
    });
      // calls ASX API to get company information from AUSTRALIAN stockCode (without .AX)
      function callASXCompanyInfo(stockCode, end_date) {

          console.log("calling ASX API...");
          Meteor.call('getASXCompanyInfo', stockCode, function(error, result) {
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
            } else {
              console.log(error);
              console.log("ASX did not find " + stockCode);
            }
          });

          console.log("calling ASX dividends...");
          Meteor.call('getASXDividends', stockCode, function(error, result) {
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
            } else {
              console.log(error);
            }
          })

          console.log("calling ASX announcements...");
          Meteor.call('getASXAnnouncements', stockCode, endDate, function(error, result) {
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
            } else {
              console.log(error);
            }
          })
      }

      // guardian API call to get x num of articles between certain dates (but hard cap at 100; change below if needed)
      function callGuardianAPI(queryString, sector, x, begin_date, end_date, sessionKeyword) {
          console.log("callGuarddianAPI " + queryTopic + " " + x + " " + begin_date + " " + end_date);

          if (sessionKeyword === "sectionNewsData") {
            var section = "australia-news";
          } else {
            queryString = queryString + " AND " + sector + " AND shares";
            var section = "business";
          }

          Meteor.call('getGuardianNews', section, begin_date, end_date, x, queryString, function (error, result) {
                  if (error) {
                      console.log(error);
                      return null;
                  } else {

                      var newsArray = [];
                      var sectionId = []; // to determine company's main sector
                      sectionId["maxNum"] = 0;
                      sectionId["name"] = "";

                      var parsedResult = JSON.parse(result.content);
                      var length = Math.min(10, parsedResult.response.results.length); // hard cap set here

                      for (var i = 0; i < length; i++) {
                          var article = parsedResult.response.results[i];
                          if (article.type !== "article") continue;

                          // newsArray[i] = article;
                          var newsData = {
                            headline: (article.webTitle === undefined) ? "" : article.webTitle,
                            url: article.webUrl,
                            source: "The Guardian UK",
                            // publication date in YYYY-MM-DD'T'HH:MM:SS'Z' -> DD/MM/YYYY
                            date: article.webPublicationDate.substring(8, 10) + "/" + article.webPublicationDate.substring(5, 7) + "/" + article.webPublicationDate.substring(0, 4),
                          }

                          newsArray.push(newsData);
                      }

                      // console.log(newsArray);
                      if (sessionKeyword === "sectionNewsData") {
                        companyData.sectionNewsData = newsArray;
                      } else {
                        companyData.otherNews = newsArray;
                      }
                      // Session.set(sessionKeyword, newsArray);
                      // News.set([{
                      //     code: "News",
                      //     data: newsArray,
                      // }])
                  }
              });
      };
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
            <Navbar.Form inline>
            <BSButton onClick={ this.resetTile }>View Sectors</BSButton>

            </Navbar.Form>
            <CheckboxGroup value={ this.state.currSelectedStocks } onChange={ this.handleOptionChange }>
              {this.renderStocks()}
            </CheckboxGroup>
          </Navbar>
        </div>
        <div className="container-fluid main-container">
          <div className="tile-container">
           {this.renderTile()}
          </div>
        </div>
      </div>
    );
  }
}


App.propTypes = {
  ddata: PropTypes.array.isRequired,
  comps: PropTypes.array.isRequired,
  stocks: PropTypes.array.isRequired,
  activeStocks: PropTypes.array.isRequired,
  selectedStocks: PropTypes.array,
  newsData: PropTypes.array,
};

export default createContainer(() => {
  return {
    ddata: Data.find({}).fetch(),
    comps: Companies.find({}).fetch(),
    stocks: Stocks.find({}).fetch(),
    activeStocks: ActiveStocks.find({}).fetch(),
    selectedStocks: SelectedStock.get(),
    newsData: News.get(),
  };
}, App);
