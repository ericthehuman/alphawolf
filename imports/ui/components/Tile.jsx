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

  //converts raw api data into structure the graph component uses
  parseDataIntoGraph(result, news){
    if(result != null){

        // console.log(result);
        // console.log("NEWS: " + JSON.stringify(news));
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
        console.log("DATESTR:" + datestr);
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

        // console.log(currNewsData);
        newsData.push(currNewsData);
      }

      // i = 0;
  	  // while(i < array.length){
  	  // 	var headline = "";
  	  // 	var url = "";
      //
  	  // 	/*for (var j = 0; j < news.length; j++) {
  	  // 		// add news or industry per date, but limited to one article per day?? -- to avoid same news? fix for now (otherwise should compare article number or something)
  	  // 		if (news[j] !== undefined && array[i].Date === news[j].date) {
			// 	numMatches++;
  		// 		headline = news[j].headline;
  		// 		url = news[j].url;
      //           break;
  		// 	} else if (section[j] !== undefined && array[i].Date === section[j].date) {
      //           numMatches++;
      //           headline = section[j].headline;
      //           url = section[j].url;
      //           break;
      //       }
      //   }*/
      //   values.push(Math.round((array[i].Close)*100));
  	  //   data.push({
  	  //     name: array[i].Date,
  	  //     value: Math.round((array[i].Close)*100),
  		//     info: headline,
  		//     url: url,
  	  //    });
  	  //   i = i +1;
  	  // }

      console.log("AAAAA");
      console.log(stockData);
      console.log(newsData);
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
      // return data;
      console.log("AAAA2");
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

		if(data.code === "Home") {
  		return (
  			<div className="tile">
  				<Item news={"Uber stocks fall amidst scandals"} imagef={"uber.jpg"}/>
  				<Item news={"Apple releases new software"} imagef={"apple.png"}/>
  				<Item news={"ThinkPad designs sleek computer"} imagef={"thinkpad.jpg"}/>
  				<Item news={"UNSW records record numbers"} imagef={"unsw.jpg"}/>
  			</div>
  			);
		} else {
      var news = data.companyNews;
      console.log("news is: " + news);
      this.parseDataIntoGraph(data.stock_data, news);
    	// var companySum = this.getCompanySummary(data.name);
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var yearBefore = Math.max(NUMDAYS-365, 0);
      var monthBefore = Math.max(NUMDAYS-30, 0);

      var currClose = companyReturns[NUMDAYS].Close;
      var prevClose = companyReturns[NUMDAYS-1].Close;
      var positiveSignDay = (companyReturns[NUMDAYS].Close-companyReturns[NUMDAYS-1].Close) >= 0 ? "+" : "";
      var positiveSignMonth = (companyReturns[NUMDAYS].Close-companyReturns[monthBefore].Close) >= 0 ? "+" : "";
      var positiveSignAnnual = (companyReturns[NUMDAYS].Close-companyReturns[yearBefore].Close) >= 0 ? "+" : "";
      var highestCloseMonth = parseFloat(companyReturns[monthBefore].Close);
      var lowestCloseMonth = parseFloat(companyReturns[monthBefore].Close);
      var highestCloseAnnual = parseFloat(companyReturns[yearBefore].Close);
      var lowestCloseAnnual = parseFloat(companyReturns[yearBefore].Close);

      console.log("Array length: " + companyReturns.length);

      // Get the lowest and highest values of the stock for year, month
      for (var i = monthBefore; i < companyReturns.length; i++) {
        var compareClose = parseFloat(companyReturns[i].Close);
        // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
        if (compareClose > highestCloseMonth) highestCloseMonth = compareClose;
        if (compareClose < lowestCloseMonth) lowestCloseMonth = compareClose;
      }

      for (var i = yearBefore; i < companyReturns.length; i++) {
        var compareClose = parseFloat(companyReturns[i].Close);
        // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
        if (compareClose > highestCloseAnnual) highestCloseAnnual = compareClose;
        if (compareClose < lowestCloseAnnual) lowestCloseAnnual = compareClose;
      }

      console.log("Curr: " + currClose + " | Prev: " + prevClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual);
			return (
				<div className="tile">
					<div className="big">
            <img src={data.logo_img_url} className="company-logo"/><h1>{data.name} <span className="stock-code">({data.code})</span></h1>
            <p>{data.short_description}</p>
            <br/>
            <p><a href={data.url}>{data.url}</a> {data.phone}</p>
            <h2> <b>${parseFloat(currClose).toFixed(2)}</b> <span className={positiveSignDay === "+" ? "stock-positive" : "stock-negative"}>{positiveSignDay}
            {parseFloat(currClose-prevClose).toFixed(2)} ({positiveSignDay}{parseFloat((currClose-prevClose)/prevClose*100).toFixed(2)}%)</span></h2>
            <Table>
              <thead>
                <tr>
                  <th colSpan="2">Statistics</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Previous close</td>
                  <td><b>{parseFloat(prevClose).toFixed(2)}</b></td>
                </tr>
                <tr>
                  <td>Monthly change</td>
                  <td className={positiveSignMonth === "+" ? "stock-positive" : "stock-negative"}><b>{parseFloat(currClose-companyReturns[monthBefore].Close).toFixed(2)}{' '}
                  ({positiveSignMonth}{parseFloat((currClose-companyReturns[monthBefore].Close)/companyReturns[monthBefore].Close*100).toFixed(2)}%)</b></td>
                </tr>
                <tr>
                  <td>Monthly high</td>
                  <td><b>{parseFloat(highestCloseMonth).toFixed(2)}</b></td>
                </tr>
                <tr>
                  <td>Monthly low</td>
                  <td><b>{parseFloat(lowestCloseMonth).toFixed(2)}</b></td>
                </tr>
                <tr>
                  <td>Annual change</td>
                  <td className={positiveSignAnnual === "+" ? "stock-positive" : "stock-negative"}><b>{parseFloat(currClose-companyReturns[yearBefore].Close).toFixed(2)}{' '}
                  ({positiveSignAnnual}{parseFloat((currClose-companyReturns[yearBefore].Close)/companyReturns[yearBefore].Close*100).toFixed(2)}%)</b></td>
                </tr>
                <tr>
                  <td>Annual high</td>
                  <td><b>{parseFloat(highestCloseAnnual).toFixed(2)}</b></td>
                </tr>
                <tr>
                  <td>Annual low</td>
                  <td><b>{parseFloat(lowestCloseAnnual).toFixed(2)}</b></td>
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
};
