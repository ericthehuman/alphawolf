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
}

renderTile() {
  return (
    <div>
      <Tile stockData={this.props.selectedStocks} onChange={this.changeToSector.bind(this)}/>
    </div>
  );
}

// Reset the tile back to the home page
resetTile() {
  SelectedStock.set([{ code: "Home" }]);
  this.setState({ currSelectedStocks: [] });
}

// Reset the tile back to the home page
changeToSector(sectorName) {
  console.log(sectorName.currentTarget.value);
  SelectedStock.set([{ code: sectorName.currentTarget.value }]);
  this.setState({ currSelectedStocks: [] });
}

handleOptionChange(companiesList) {
  if (companiesList.length === 0) {
    this.resetTile();
    return;
  }

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
    code: "dontshowthisever",
    name: "Company",
    sector: "Sector",
    short_description: "Summary",
    url: "Company Website",
    phone: "Phone no.",
    yesterdayClose: "Close",
    prevClose: "Previous close",
    monthlyChange: "Monthly change",
    monthlyHigh: "Monthly high",
    monthlyLow: "Monthly low",
    annualChange: "Annual change",
    annualHigh: "Annual high",
    annualLow: "Annual low"
  }

  // If we are comparing stocks we want these labels in the middle
  if (dataArray.length === 2) {
    dataArray.splice(1, 0, info);
  // Otherwise have them upfront
  } else {
    dataArray.splice(0, 0, info);
  }

  SelectedStock.set(dataArray);

}

handleStockScope (event){

}

renderStocks() {
  // if (this.props.activeStocks.length > 8) {
  //   ActiveStocks.remove({_id:Stocks.findOne({code: this.props.activeStocks[0].code})['_id']});
  // }
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
  var companyCode = newCompanies[0].replace(/\.AX$/, "");
  console.log("Company code is: " + companyCode);

  // Check if its a duplicate stock
  var stockExists = ActiveStocks.findOne({code: companyCode});
  if (stockExists) {
    console.log("Exists already");
    console.log(stockExists);
    return;
  }

  var companyData = {};

  var stockToUpdate = Stocks.findOne({code: companyCode});
  var companyName = stockToUpdate.name;

  // retrieve company information from ASX -> fail -> 2. Intrinio
  // var begin_date = moment().subtract(30, 'days').format('YYYY-MM-DD');
  // var end_date = moment().format('YYYY-MM-DD');

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

  Meteor.call('getASXAnnouncements', companyCode, function(error, result) {
    if (result) {
      var raw = JSON.parse(result.content);
      raw = raw.data;
      var announcements = [];
      // console.log(raw);
      // console.log("IS THIS HAPPENING");
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

  console.log("START GUARDIAN CALL " + companyName);
  var words = companyName.split(/\s/);
  var queryString = words[0] + "%20AND%20" + words[1] + "%20AND%20markets";
  console.log("queryString " + queryString);
  Meteor.call('getGuardianNews', queryString, function (error, result) {
    if (error) {
      console.log(error);
      console.log("in news");
      return null;
    } else {

    var newsArray = [];
    var parsedResult = JSON.parse(result.content);
    var length = Math.min(100, parsedResult.response.results.length); // hard cap set here

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
        section: article.sectionId
      }

      newsArray.push(newsData);
    }
    companyData.companyNews = newsArray;
    }
  });

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
      alert(error);
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

  this.forceUpdate();
}

  render() {
    return (
      <div>
        <div>
          <Navbar fixedTop className="navbar-custom">
            <Navbar.Header>
              <Navbar.Brand>
                <span id="title">COWS</span>
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
           <div id="container"> </div>
           <div id="container2"> </div>
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
  };
}, App);
