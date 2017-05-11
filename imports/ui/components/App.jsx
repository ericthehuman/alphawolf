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
    submitted: false,
    selectMultiple: false
  };
  this.newsData = function () {
    return Session.get('newsData');
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
        <Tile stockData={this.props.selectedStocks} />
      </div>
    );
  }

}

handleOptionChange(eventChange) {

  //this is necessary to display changes in UI state
  var stockName = eventChange.currentTarget.value;
  var stockCode = eventChange.currentTarget.id;
  // console.log("Stock name: " + stockName);

  console.log("option Changed to " + stockCode);

  if(stockCode != "Home"){
    Meteor.call('getData', stockCode, function(error, result) {
      if(result){
        //get what i want from result
        // console.log(result);
        // console.log("Namee is still: " + stockName);
        SelectedStock.set([{
          name: stockName,
          code: stockCode,
          data: result
        }]);
      } else {
        console.log(error);
      }
    });

      // assume there is function to retrieve dates

      // var begin_date = moment().subtract(365, 'days').format('YYYYMMDD'); // NYT dates must be in format YYYYMMDD
      // var end_date = moment().format('YYYYMMDD');
      // console.log("Begin: " + begin_date + " | End: " + end_date);
      var begin_date = "20161228";
      var end_date = "20170407";
      var companyName = "";
      if (stockCode === "MSFT")
        companyName = "Microsoft";
      else if (stockCode === "AAPL")
        companyName = "Apple Inc";
      else if (stockCode === "BBRY")
        companyName = "Blackberry";

      Meteor.http.call('GET',
          'https://api.nytimes.com/svc/search/v2/articlesearch.json?'
          + 'api-key=' + "591e19bb7d974693b30e645f3288102d"
          + '&q=' + companyName
          + '&begin_date=' + begin_date
          + '&end_date=' + end_date,
          function (error, result) {
          if (error) {
              console.log(error);
          } else {
              var newsArray = [];
              console.log("Returning articles on " + companyName);
              var parsedresult = JSON.parse(result.content);
              console.log(parsedresult.response.docs.length);
              var length = Math.min(100, parsedresult.response.docs.length);
              for (var i = 0; i < length; i++) {
                  var article = parsedresult.response.docs[i];
                  newsArray[i] = article;
                  newsArray[i]['headline'] = (article.headline != null) ? article.headline.main : "";
                  newsArray[i]['abstract'] = (article.snippet != null) ? article.snippet : article.lead_paragraph; // summary of article
                  newsArray[i]['url'] = article.web_url; // url of article
                  newsArray[i]['source'] = article.source; // name of news source i.e. NYT
                  newsArray[i]['date'] = article.pub_date.substring(8,10)+"/"+article.pub_date.substring(5,7)+"/"+article.pub_date.substring(0,4); // publication date in YYYY-MM-DD'T'HH:MM:SS'Z' -> DD/MM/YYYY
                  newsArray[i]['pic'] = (article.multimedia.length != 0) ? "http://www.nytimes.com" + article.multimedia["0"].url : "no pic"; // this may not necessarily be related to news, but also icons
                  // console.log(newsArray[i].headline + " " + newsArray[i].abstract + " " + newsArray[i].web_url + " " + newsArray[i].source + " " + newsArray[i].date + " " + newsArray[i].pic);
              }

              console.log(newsArray);
              // SelectedStock.set({
              //   news: newsArray
              // });
              Session.set('newsData', newsArray);
          }
      });

  } else {
    console.log("Home");
    SelectedStock.set([{
      code: "Home",
      data: "",
    }])
  }

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
  selectedStocks: PropTypes.array,
};

export default createContainer(() => {
  return {
    ddata: Data.find({}).fetch(),
    comps: Companies.find({}).fetch(),
    stocks: Stocks.find({}).fetch(),
    selectedStocks: SelectedStock.get()
  };
}, App);
