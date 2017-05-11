import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies, Stocks, SelectedStock } from '../../api/data.js';
import Tile from './Tile.jsx';
import Button from './Button.jsx';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { ReactiveVar } from 'meteor/reactive-var';
import { Button as BSButton, Form, FormControl, FormGroup, Nav, NavItem, Navbar  } from 'react-bootstrap';
import moment from 'moment';




// App component - represents the whole app
class App extends Component {

constructor(props){
  super(props);
  this.handleOptionChange = this.handleOptionChange.bind(this);
  this.addStock = this.addStock.bind(this);
  this.state = {
    selected: "Home",
    submitted: false,
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

//if there are two selected things
//if there is one selected thing max

  // console.log("Code to pass: " + this.props.selectedStock.code);
  // console.log("Name to pass: " + this.props.selectedStock.name);
  if(this.props.selectedStock.code == "Home"){
    return (
      <div>
        <Tile stockData={this.props.selectedStock} display={"Home"} />
      </div>
    );
  }else{
    return (
      <div>
        <Tile stockData={this.props.selectedStock} />
      </div>
    );
  }

}

handleOptionChange(eventChange) {

  //this is necessary to display changes in UI state
  var stockName = eventChange.currentTarget.value;
  var stockCode = eventChange.currentTarget.id;
  // console.log("Stock name: " + stockName);

  this.setState({
    selected: stockCode
  });


  console.log("option Changed to " + stockCode);

  if(stockCode != "Home"){
    Meteor.call('getData', stockCode, function(error, result) {
      if(result){
        //get what i want from result
        // console.log(result);
        // console.log("Namee is still: " + stockName);
        SelectedStock.set({
          name: stockName,
          code: stockCode,
          data: result
        });
      } else {
        console.log(error);
      }
    });

      // retrieve company information from Intrinio
      this.callIntrinioAPI(stockCode, function (result) {

          console.log("should trigger this function???");
          console.log(result);

          // assume there is function to retrieve dates
          // var begin_date = moment().subtract(365, 'days').format('YYYYMMDD');
          // var end_date = moment().format('YYYYMMDD');
          // console.log("Begin: " + begin_date + " | End: " + end_date);
          var begin_date = "2016-12-28";
          var end_date = "2017-04-07";

          // The Guardian date must be in format YYYY-MM-DD
          // NYT dates must be in format YYYYMMDD
          // switch number of articles returned by specifying 2nd param in this call
          callGuardianAPI(stockName, 100, begin_date, end_date, 'newsData');
          callGuardianAPI(result.sector, 100, begin_date, end_date, 'sectionNewsData');

      });

  } else {
    console.log("Home");
    SelectedStock.set({
      code: "Home",
      data: "",
    })
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
                }
            });
    };

}

// calls Intrinio API to get company information from its stockCode
callIntrinioAPI(stockCode, callback) {
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
    }, function(error, result) {
        if (result) {
            var company = JSON.parse(result.content);
            console.log(company);

            var companyData = [];
            companyData["name"] = company.name;
            companyData["short_description"] = company.short_description;
            companyData["ceo"] = company.ceo;
            companyData["url"] = company.company_url;
            companyData["address"] = company.business_address;
            companyData["phone"] = company.business_phone_no;
            companyData["securities"] = company.securities; // can have multiple stocks, so this is an array
            companyData["sector"] = company.sector;
            companyData["industry_category"] = company.industry_category;

            Session.set('companyData', companyData);
            console.log(companyData);
            return callback(companyData);

        } else {
            console.log("Shites not working");
            console.log(error);
        }
    });
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
  // console.log(newCompanies);
  for (var i = 0; i < newCompanies.length; i++) {
    var codeRegex = /\((.*)\)$/;
    var companyName = newCompanies[i];
    var companyCode = codeRegex.exec(companyName);
    companyName = companyName.replace(/\s\(.*\)$/, "");
    console.log("Regexed company name: " + companyName);
    Stocks.insert({
      name: companyName,
      code: companyCode[1],
      new: true
    });
    console.log("Stock added");
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
            <Form>

              {this.renderStocks()}

            </Form>
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
  selectedStock: PropTypes.object,
};

export default createContainer(() => {
  return {
    ddata: Data.find({}).fetch(),
    comps: Companies.find({}).fetch(),
    stocks: Stocks.find({}).fetch(),
    selectedStock: SelectedStock.get()
  };
}, App);
