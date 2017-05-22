import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies, Stocks, ActiveStocks, SelectedStock } from '../../api/data.js';
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
  this.resetTile = this.resetTile.bind(this);
  this.state = {
    currSelectedStocks: [],
    submitted: false,
    selectMultiple: false
  };
  // this.newsData = function () {
  //     return Session.get('newsData');
  // }
  // this.sectionNewsData = function () {
  //     return Session.get('sectionNewsData');
  // }
  // this.companyData = function() {
  //     return Session.get('companyData');
  // }
}

renderTile() {
  return (
    <div>
      <Tile stockData={this.props.selectedStocks}/>
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

  console.log(companiesList);
  var stocksToShow = Stocks.find({name: { $in: companiesList } } ).fetch();

  var dataArray = [];
  for (var i = 0; i < stocksToShow.length; i++) {
    console.log("Curr stock to show: " + stocksToShow[i].name + " (" + stocksToShow[i].code + ")");
    var data = {
      code: stocksToShow[i].code,
      name: stocksToShow[i].name,
      sector: stocksToShow[i].sector,
      market_cap: stocksToShow[i].market_cap,
      weight_percent: stocksToShow[i].weight_percent,
      stock_data: stocksToShow[i].stock_data,
      short_description: stocksToShow[i].short_description,
      url: stocksToShow[i].url,
      address: stocksToShow[i].address,
      logo_img_url: stocksToShow[i].logo_img_url,
      phone: stocksToShow[i].phone,
      dividends: stocksToShow[i].dividends,
      announcements: stocksToShow[i].announcements,
      // sectionNewsData: stocksToShow[i].sectionNewsData,
      companyNews: stocksToShow[i].companyNews,
    };

    if (i === 0 && stocksToShow.length > 1) {
      data.firstStock = true;
    } else {
      data.firstStock = false;
    }
    dataArray.push(data);
  }
  var info = {
    name: " ",
    sector: "Sector",
    short_description: "Summary",
    url: "Company Website",
    phone: "Phone no."
  }

  SelectedStock.set(dataArray);

}

handleStockScope (event){

}

renderStocks() {
  return this.props.activeStocks.map((stock) => (
    <Button key={stock._id} stock={stock} optionChange={this.handleOptionChange.bind(this)} />
    ));
}

// New submit
addStock() {
  if (!this.refs.inputVal.value) {
    return;
  }
  var newCompanies = JSON.parse(this.refs.inputVal.value);
  console.log("Company code is: " + newCompanies[0]);
  for (var i = 0; i < newCompanies.length; i++) {
    var companyData = {};

    var companyCode = newCompanies[i].replace(/\.AX$/, "");
    var stockToUpdate = Stocks.findOne({code: companyCode});
    var companyName = stockToUpdate.name;

    // retrieve company information from ASX -> fail -> 2. Intrinio
    var begin_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
    var end_date = moment().format('YYYY-MM-DD');

    Meteor.call('getASXCompanyInfo', companyCode, function(error, result) {
      if (result) {
        var company = JSON.parse(result.content);
        companyData.name = company.name_full;
        companyData.short_description = company.principal_activities;
        companyData.ceo = "";
        companyData.url = company.web_address;
        companyData.address = company.mailing_address;
        companyData.logo_img_url = company.logo_image_url;
        companyData.phone = company.phone_number;
        companyData.sector = company.sector_name;
      } else {
        console.log(error);
        console.log("ASX did not find " + stockCode);
      }
    });

    Meteor.call('getASXDividends', companyCode, function(error, result) {
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
        console.log("in dividends");
      }
    });

    Meteor.call('getASXAnnouncements', companyCode, end_date, function(error, result) {
      if (result) {
        var raw = JSON.parse(result.content);
        raw = raw.data;
        var announcements = [];
        console.log(raw);
        for (var i = 0; i < raw.length; i++) {
            var date = moment(raw[i].document_date).format('DD/MM/YYYY');
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
        console.log("in announcements");
      }
    });

    var sector = stockToUpdate.sector.replace(/&/, "AND");
    var nameWithoutCode = companyName.replace(/\s\(.*\)$/, "");
    console.log("Sector: " + sector);

    Meteor.call('getGuardianNews', "australia-news", begin_date, end_date, 20, nameWithoutCode + " AND " + sector, function (error, result) {
        if (error) {
            console.log(error);
            console.log("in news");
            return null;
        } else {

            var newsArray = [];
            var sectionId = []; // to determine company's main sector
            sectionId["maxNum"] = 0;
            sectionId["name"] = "";

            var parsedResult = JSON.parse(result.content);
            var length = Math.min(20, parsedResult.response.results.length); // hard cap set here

            console.log(parsedResult);
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

            companyData.companyNews = newsArray;
            // Session.set(sessionKeyword, newsArray);
        }
    });
    // callGuardianAPI(companyName, sector, 20, begin_date, end_date, 'newsData', companyData);
    // callGuardianAPI(companyName, sector, 20, begin_date, end_date, 'sectionNewsData', companyData);

    Meteor.call('getData', companyCode, function(error, result) {
      if (result) {
        var res = JSON.parse(result.content);
        if (res.Log.Success) {
          var stockData = res.CompanyReturns[0].Data;

          companyData.stock_data = stockData;
        } else {
          console.log(res.Log.ErrorMessage);
        }
      } else {
        console.log(error);
      }
      ActiveStocks.insert({name: companyName, code: companyCode, new: true});
      Stocks.update({_id:Stocks.findOne({code: companyCode})['_id']},
      {$set: {stock_data: companyData.stock_data,
        short_description: companyData.short_description,
        url: companyData.url,
        address: companyData.address,
        logo_img_url: companyData.logo_img_url,
        phone: companyData.phone,
        dividends: companyData.dividends,
        announcements: companyData.announcements,
        // sectionNewsData: companyData.sectionNewsData,
        companyNews: companyData.companyNews,
      }});

      // var stockToUpdate = Stocks.findOne({code: companyCode});
      // console.log("Stock added: " + JSON.stringify(stockToUpdate));
    });
  }

  this.forceUpdate();
}

  render() {
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
            <div className="row nav-bottom-row">
              <Navbar.Form inline>
              <BSButton className="col-md-2" onClick={ this.resetTile }>View Sectors</BSButton>

              <CheckboxGroup className="col-md-10" value={ this.state.currSelectedStocks } onChange={ this.handleOptionChange }>
                {this.renderStocks()}
              </CheckboxGroup>
              </Navbar.Form>
            </div>
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

// guardian API call to get x num of articles between certain dates (but hard cap at 100; change below if needed)
function callGuardianAPI(queryString, sector, x, begin_date, end_date, sessionKeyword, companyData) {

    var companyData = {};
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
              companyData.companyNews = newsArray;
            }
            // Session.set(sessionKeyword, newsArray);
        }
    });

    return companyData;
};

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
  };
}, App);
