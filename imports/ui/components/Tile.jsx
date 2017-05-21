import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import Item from './Item.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { Table, Form } from 'react-bootstrap';

import { Data, Companies, Stocks, SelectedStock, News } from '../../api/data.js';
import Button from './Button.jsx';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
var Highcharts = require('highcharts/highstock');
//var Highcharts = require('highcharts');
//var Highstock = require('react-highstock');




export default class Tile extends Component {

  handleClickItem (){
    //re-renders tiles
    console.log("something is pressed!\n");
  }

  //converts raw api data into structure the graph component uses
  parseDataIntoGraph(result, news, section){
    if(result != null){

        // console.log(result);
        // console.log(news);
        // console.log(section);
  	  var array = result;
  	  var data = [];
  	  var i = 0;
  	  var numMatches = 0;
      var dates = [];
      var values = [];
      var stockData = [];
      var newsData = [];
      // convert data for graphing on high stocks
      // format:
      // [[timestamp, stockValue], [timestamp, stockValue] ....]
      for (i = 0; i < array.length; i ++) {
        var datestr = array[i].Date;
        datestr = datestr.split("/");
        var dd = datestr[0];
        var mm = datestr[1];
        var yyyy = datestr[2];
        var timestamp = (new Date(yyyy,mm, dd).getTime());
        var currStockData = [];
        currStockData.push(timestamp);
        dates.push(timestamp);
        currStockData.push(Math.round((array[i].Close)*100));
        stockData.push(currStockData);
      }

      // parse data for displaying news
      for (var j = 0; j < news.length; j++) {
        var currNewsItem = news[j];
        var newsDate = currNewsItem["date"];

        var datestr = newsDate.split("/");
        var dd = datestr[0];
        var mm = datestr[1];
        var yyyy = datestr[2];
        var timestamp = (new Date(yyyy,mm, dd).getTime());

        var newsHeadline = currNewsItem["headline"];
        var currNewsData = {x: timestamp, title: newsHeadline};

        newsData.push(currNewsData);
      }

      i = 0;
  	  while(i < array.length){
  	  	var headline = "";
  	  	var url = "";

  	  	/*for (var j = 0; j < news.length; j++) {
  	  		// add news or industry per date, but limited to one article per day?? -- to avoid same news? fix for now (otherwise should compare article number or something)
  	  		if (news[j] !== undefined && array[i].Date === news[j].date) {
				numMatches++;
  				headline = news[j].headline;
  				url = news[j].url;
                break;
  			} else if (section[j] !== undefined && array[i].Date === section[j].date) {
                numMatches++;
                headline = section[j].headline;
                url = section[j].url;
                break;
            }
        }*/
        values.push(Math.round((array[i].Close)*100));
  	    data.push({
  	      name: array[i].Date,
  	      value: Math.round((array[i].Close)*100),
  		    info: headline,
  		    url: url,
  	     });
  	    i = i +1;
  	  }        console.log("num of article matches " + numMatches);

       var chart = Highcharts.stockChart('container', {

        series: [{
          data: stockData,//values,
          name: "Closing Price",
          id: "stockData"
        },{
            type: 'flags',
            name: 'Flags on series',
            data: newsData,
            onSeries: 'stockData',
            shape: 'squarepin'
        }
        ],
        title: {
          text: "Closing Price"
        }
        // ... more options - see http://api.highcharts.com/highcharts
        });
        return data;
  	}
  }


  //get some info about the company
  getCompanySummary(Name){
  	console.log("the stock name to get summary from is"+ " "+Name);
  	var resultString;
  		//invoke the server method
  	if (Meteor.isClient && Name){
  	    Meteor.call("getSummary", Name, function(error, results) {
  	    	resultString = results.content.toString();
  	    	resultString = /\"extract\"\:\"(.*)\"\}{4}/.exec(resultString);
  	    	console.log(resultString[1]);
  	    	return resultString[1];
  	    });

  	}
  }

	//renders a whole bunch of stats for the user
	render() {

    // While we only have functionality for 1 stock

    var data = this.props.stockData[0];
    console.log("CODE: " + data.code);
    //rendering news page here
    //value consponds to data code which will be used as a switch function
		if(data.code === "Home") {
  		return (
  			<div className="tile">
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Consumer Discretionary"} imagef={"http://www.sharesinv.com/wp-content/uploads/articles/consumer-ETFs.jpg"} value={"consumer1"}/>
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Consumer Staples"} imagef={"http://www.etftrends.com/wp-content/uploads/2012/10/consumer-staples-etfs.png"} value={"consumer2"}/>
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Energy"} imagef={"https://www.dentons.com/-/media/images/website/background-images/industry-sectors/energy/energy-2.jpg  "} value={"Energy"}/>
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Financial"} imagef={"http://static.memrise.com/uploads/course_photos/3146044000150629230223.jpg"} value={"financial"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Health Care"} imagef={"http://www.philips.com.au/c-dam/b2bhc/us/homepage-rebranded/specialties_heartmonitor.png"} value={"health"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Industrials"} imagef={"http://relaypowersystems.com/wp-content/uploads/2011/10/refinery.jpg"} value={"industrials"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"IT- Information Technology"} imagef={"https://i.ytimg.com/vi/GyfPJ1i1Y5Y/maxresdefault.jpg "} value={"it"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Materials"} imagef={"http://cambabest.co.uk/wp-content/uploads/2015/02/Building-banner1.jpg"} value={"materials"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Metals and Minning"} imagef={"http://rsb-industries.com/images/Metal_Mining.jpg"} value={"metalmine"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Resources"} imagef={"http://psychology.berkeley.edu/sites/default/files/styles/1000x400sc/public/Resources%20page%20photo_0.jpg?itok=dLdmH90P"} value={"resource"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Telecommunications Services"} imagef={"https://www.sevone.com/sites/default/files/images/telecommunications-map.jpg"} value={"telecom"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Utilities"} imagef={"http://allentownboronj.com/vertical/Sites/%7B7748EEEB-2391-4653-8B6A-4A64C85A6D79%7D/uploads/8329283_orig.jpg"} value={"util"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Bank"} imagef={"https://cdn.pixabay.com/photo/2015/10/14/18/43/bank-988164_960_720.png"} value={"bank"}/>
          </div>
  			);
		} else {
      var news = this.props.newsData[0];
      this.parseDataIntoGraph(data.data, news.data, Session.get('sectionNewsData'));
    	// var companySum = this.getCompanySummary(data.name);
			// console.log(this.parseDataIntoGraph(data.data));
      var companyReturns = data.data;
      var NUMDAYS = companyReturns.length-2;

      var currClose = companyReturns[NUMDAYS].Close;
      var prevClose = companyReturns[NUMDAYS-1].Close;
      var positiveSignDay = (companyReturns[NUMDAYS].Close-companyReturns[NUMDAYS-1].Close) >= 0 ? "+" : "";
      var positiveSignAnnual = (companyReturns[NUMDAYS].Close-companyReturns[0].Close) >= 0 ? "+" : "";
      var highestClose = parseFloat(companyReturns[0].Close);
      var lowestClose = parseFloat(companyReturns[0].Close);

      console.log("Array length: " + companyReturns.length);
      // Get the lowest and highest values of the stock
      for (var i = 0; i < companyReturns.length; i++) {
        var compareClose = parseFloat(companyReturns[i].Close);
        // console.log("Curr: " + compareClose + " | high: " + highestClose + " | low: " + lowestClose + " | typeof(high): " + typeof(highestClose));
        if (compareClose > highestClose) highestClose = compareClose;
        if (compareClose < lowestClose) lowestClose = compareClose;
      }

      console.log("Curr: " + currClose + " | Prev: " + prevClose + " | high: " + highestClose + " | low: " + lowestClose);
			return (
				<div className="tile">
					<div className="big">
            <h1>{data.name} <span className="stock-code">({data.code})</span></h1>
            <h2> <b>${parseFloat(currClose).toFixed(2)}</b> <span className={positiveSignDay === "+" ? "stock-positive" : "stock-negative"}>{positiveSignDay}
            {parseFloat(currClose-prevClose).toFixed(2)} ({positiveSignDay}{parseFloat((currClose-prevClose)/prevClose*100).toFixed(2)}%)</span></h2>
            <Table>
              <thead>
                <tr>
                  <th colspan="2">Statistics</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Previous close</td>
                  <td><b>{parseFloat(prevClose).toFixed(2)}</b></td>
                </tr>
                <tr>
                  <td>52-week change</td>
                  <td className={positiveSignAnnual === "+" ? "stock-positive" : "stock-negative"}><b>{parseFloat(currClose-companyReturns[0].Close).toFixed(2)}{' '}
                  ({positiveSignAnnual}{parseFloat((currClose-companyReturns[0].Close)/companyReturns[0].Close*100).toFixed(2)}%)</b></td>
                </tr>
                <tr>
                  <td>52-week high</td>
                  <td><b>{parseFloat(highestClose).toFixed(2)}</b></td>
                </tr>
                <tr>
                  <td>52-week low</td>
                  <td><b>{parseFloat(lowestClose).toFixed(2)}</b></td>
                </tr>
              </tbody>
            </Table>
  					{/*this.getCompanySummary(data.name)*/}
					</div>
            <div id="container"></div>
				</div>

				);
		}
	}
}

// function showTooltipData (data) {
//     if ( typeof data.payload[0] !== 'undefined') {
//         // console.log(data.news);
//         // console.log(Object.keys(data.payload[0]));
//         // console.log(Object.values(data.payload[0]));
//     	var date = data.payload[0].payload.name;
//     	var value = data.payload[0].payload.value;
//     	var info = data.payload[0].payload.info;
//     	var url = data.payload[0].payload.url;
//
//       if (typeof(info) != 'undefined') {
//         // return tooltip as url link if there exists an article, or just return share data
//     		return <div id="tag">{date}<br/>
//     							 Price: ${value/100}<br/>
//     			                 <a href={(url !== "") ? url : ""} target="_blank">
//     							 {(info !== "") ? "NEWS:" + info : ""}</a></div>;
//       } else {
//           return <div id="tag">{date}<br/>
//       							 Cumulative Return: {value}%<br/></div>;
//       }
//     }
//
// }


Tile.propTypes = {
  // This component gets the return figure to display through a React prop.
  // We can use propTypes to indicate it is required
  stockData: PropTypes.array.isRequired,
  newsData: PropTypes.array.isRequired,
};
