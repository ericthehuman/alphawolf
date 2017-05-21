import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import Item from './Item.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { Table, Form, Glyphicon, Tooltip as Toolitip,OverlayTrigger } from 'react-bootstrap';

import { Data, Companies, Stocks, SelectedStock, News } from '../../api/data.js';
import Button from './Button.jsx';

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
var Highcharts = require('highcharts/highstock');
//var Highcharts = require('highcharts');
//var Highstock = require('react-highstock');


export default class Tile extends Component {
  //converts raw api data into structure the graph component uses
  parseDataIntoGraph(result, news) {
    if(result != null) {

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
        // console.log("DATESTR:" + datestr);
        datestr = datestr.split("/");
        var dd = datestr[0];
        var mm = datestr[1];
        var yyyy = datestr[2];
        var timestamp = (new Date(yyyy,mm, dd).getTime());

        if (i > 0) {
          var oldDate = array[i-1].Date.split("/");
          var oldTime = (new Date(oldDate[2], oldDate[1], oldDate[0]).getTime());
          if (oldTime >= timestamp) console.log("OLD: " + oldDate + " | VS NEW: "+ datestr);
        }

        var currStockData = [];
        currStockData.push(timestamp);
        dates.push(timestamp);
        currStockData.push(Math.round((array[i].Close)*100));
        stockData.push(currStockData);
      }

      console.log(news);
      var currNewsItem;
      // parse data for displaying news
      for (var j = 0; j < news.length; j++) {
        currNewsItem = news[j];
        var newsDate = currNewsItem["date"];
        if (j > 0 && news[j].date === news[j-1].date) {
          console.log("aaa");
          continue;
        }

        var datestr = newsDate.split("/");
        var dd = datestr[0];
        var mm = datestr[1];
        var yyyy = datestr[2];
        var timestamp = (new Date(yyyy,mm, dd).getTime());

        var newsHeadline = currNewsItem["headline"];
        var newsUrl = "<a href=" + currNewsItem.url + ">Link</a>";
        var currNewsData = {x: timestamp, title: newsUrl, text: newsHeadline};

        // console.log(currNewsData);
        newsData.push(currNewsData);
      }

      i = 0;
  	  while(i < array.length){
  	  	var headline = "";
  	  	var url = "";

        values.push(Math.round((array[i].Close)*100));
  	    data.push({
  	      name: array[i].Date,
  	      value: Math.round((array[i].Close)*100),
  		    info: headline,
  		    url: url,
  	     });
  	    i = i +1;
  	  }
      console.log("num of article matches " + numMatches);

      var chart = Highcharts.stockChart('container', {
        series: [{
          data: stockData,//values,
          name: "Closing Price",
          id: "stockData"
        },{
            type: 'flags',
            name: 'Flags on series',
            // data: [{
            //   x : dates[10],
            //   title: "<button className='btn btn-primary' onClick={this.openModal}>Open Modal</button>",
            // }],//newsData,
            data: newsData,
            onSeries: 'stockData',
            shape: 'squarepin',
            useHTML: true,
        }],
        title: {
          text: "Closing Price"
        }
        // ... more options - see http://api.highcharts.com/highcharts
      });
      return data;
  	}
  }

  renderStocksInfo() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;

      var currClose = companyReturns[NUMDAYS].Close;
      var prevClose = companyReturns[NUMDAYS-1].Close;
      var positiveSignDay = (companyReturns[NUMDAYS].Close-companyReturns[NUMDAYS-1].Close) >= 0 ? "+" : "";

      if (!data.short_description) data.short_description = "No description available."
      if (!data.url) data.url = "No website URL available."
      if (!data.phone) data.phone = "No phone no. available."
      const tooltip_ticker = (
          <Toolitip id="tooltip"><strong>Ticker symbol</strong><br />An abbreviation used to uniquely identify publicly traded shares of a particular stock</Toolitip>
          //<font size="2"><OverlayTrigger placement="top" overlay={tooltip_ticker}><Glyphicon glyph="info-sign" /></OverlayTrigger></font>
      );
      const tooltip_close = (
          <Toolitip id="tooltip"><strong>$Close, Change in Price, % Change in price </strong><br /><div align="left">Close: The close is the last trading price recorded when the market closed on the day<br />Change: the dollar value change in the stock price from the previous day's closing price<br />% Change: The percentage change from yesterday's closing price</div></Toolitip>

          //<font size="2"><OverlayTrigger placement="top" overlay={tooltip_ticker}><Glyphicon glyph="info-sign" /></OverlayTrigger></font>
      );
      return (
      <div className={data.firstStock ? "col-md-6 align-right" : "col-md-6"}>
        <h1>{data.name} <span className="stock-code">({data.code}<font size="2"><OverlayTrigger placement="top" overlay={tooltip_ticker}><Glyphicon glyph="info-sign" /></OverlayTrigger></font>)</span></h1>
        <p>{data.short_description}</p>
        <br/>
        <p><a href={data.url}>{data.url}</a><br />{data.phone}</p>
        <h2> <b>${parseFloat(currClose).toFixed(2)}</b> <span className={positiveSignDay === "+" ? "stock-positive" : "stock-negative"}>{positiveSignDay}
        {parseFloat(currClose-prevClose).toFixed(2)} ({positiveSignDay}{parseFloat((currClose-prevClose)/prevClose*100).toFixed(2)}%)</span><font size="2"><OverlayTrigger placement="top" overlay={tooltip_close}><Glyphicon glyph="info-sign" /></OverlayTrigger></font></h2>

        {/*this.getCompanySummary(data.name)*/}
      </div>)
    });
  }

  renderPreviousClose() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var prevClose = companyReturns[NUMDAYS-1].Close;
      return (<td><b>{parseFloat(prevClose).toFixed(2)}</b></td>)
    })
  }

  renderMonthlyChange() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var monthBefore = Math.max(NUMDAYS-30, 0);

      var currClose = companyReturns[NUMDAYS].Close;
      var positiveSignMonth = (companyReturns[NUMDAYS].Close-companyReturns[monthBefore].Close) >= 0 ? "+" : "";
      return (<td className={positiveSignMonth === "+" ? "stock-positive" : "stock-negative"}><b>{parseFloat(currClose-companyReturns[monthBefore].Close).toFixed(2)}{' '}
      ({positiveSignMonth}{parseFloat((currClose-companyReturns[monthBefore].Close)/companyReturns[monthBefore].Close*100).toFixed(2)}%)</b></td>)
    })
  }

  renderMonthlyHigh() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var monthBefore = Math.max(NUMDAYS-30, 0);
      var highestCloseMonth = parseFloat(companyReturns[monthBefore].Close);

      for (var i = monthBefore; i < companyReturns.length; i++) {
        var compareClose = parseFloat(companyReturns[i].Close);
        // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
        if (compareClose > highestCloseMonth) highestCloseMonth = compareClose;
      }
      return (<td><b>{parseFloat(highestCloseMonth).toFixed(2)}</b></td>)
    })
  }

  renderMonthlyLow() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var monthBefore = Math.max(NUMDAYS-30, 0);
      var lowestCloseMonth = parseFloat(companyReturns[monthBefore].Close);

      for (var i = monthBefore; i < companyReturns.length; i++) {
        var compareClose = parseFloat(companyReturns[i].Close);
        // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
        if (compareClose < lowestCloseMonth) lowestCloseMonth = compareClose;
      }
      return (<td><b>{parseFloat(lowestCloseMonth).toFixed(2)}</b></td>)
    })
  }

  renderYearlyChange() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var yearBefore = Math.max(NUMDAYS-365, 0);

      var currClose = companyReturns[NUMDAYS].Close;
      var positiveSignAnnual = (companyReturns[NUMDAYS].Close-companyReturns[yearBefore].Close) >= 0 ? "+" : "";
      return (<td className={positiveSignAnnual === "+" ? "stock-positive" : "stock-negative"}><b>{parseFloat(currClose-companyReturns[yearBefore].Close).toFixed(2)}{' '}
      ({positiveSignAnnual}{parseFloat((currClose-companyReturns[yearBefore].Close)/companyReturns[yearBefore].Close*100).toFixed(2)}%)</b></td>)
    })
  }

  renderYearlyHigh() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var yearBefore = Math.max(NUMDAYS-365, 0);
      var highestCloseYear = parseFloat(companyReturns[yearBefore].Close);

      for (var i = yearBefore; i < companyReturns.length; i++) {
        var compareClose = parseFloat(companyReturns[i].Close);
        // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
        if (compareClose > highestCloseYear) highestCloseYear = compareClose;
      }
      return (<td><b>{parseFloat(highestCloseYear).toFixed(2)}</b></td>)
    })
  }

  renderYearlyLow() {
    return this.props.stockData.map((data) => {
      var companyReturns = data.stock_data;
      var NUMDAYS = companyReturns.length-1;
      var yearBefore = Math.max(NUMDAYS-365, 0);
      var lowestCloseYear = parseFloat(companyReturns[yearBefore].Close);

      for (var i = yearBefore; i < companyReturns.length; i++) {
        var compareClose = parseFloat(companyReturns[i].Close);
        // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
        if (compareClose < lowestCloseYear) lowestCloseYear = compareClose;
      }
      return (<td><b>{parseFloat(lowestCloseYear).toFixed(2)}</b></td>)
    })
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

    let subModalDialogStyles = {
      base: {
        bottom: -600,
        transition: 'bottom 0.4s'
      },
      open: {
        bottom: 0
      }
    }; state = {
    isOpen: false,
    isSubOpen: false
  };

  openModal = () => {
    this.setState({
      isOpen: true
    });
  };

  hideModal = () => {
    this.setState({
      isOpen: false
    });
  };

  openSubModal = () => {
    this.setState({
      isSubOpen: true
    });
  };

    var data = this.props.stockData;
    data.forEach(function(c) {
      console.log("CODES: " + c.code);
    })

		if(data[0].code === "Home") {
  		return (
  			<div className="tile">
  				<Item news={"Uber stocks fall amidst scandals"} imagef={"uber.jpg"}/>
  				<Item news={"Apple releases new software"} imagef={"apple.png"}/>
  				<Item news={"ThinkPad designs sleek computer"} imagef={"thinkpad.jpg"}/>
  				<Item news={"UNSW records record numbers"} imagef={"unsw.jpg"}/>
  			</div>
  			);
		} else {
      var news = data[0].companyNews;
      this.parseDataIntoGraph(data[0].stock_data, news);
    	// var companySum = this.getCompanySummary(data.name);

      var columnSpan = data.length+1;
			return (
				<div className="tile">
					{ this.renderStocksInfo() }
          <Table bordered hover>
            <thead>
              <tr>
                <th colSpan={columnSpan}>Statistics</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="firstCol">Previous close</td>
                { this.renderPreviousClose() }
              </tr>
              <tr>
                <td>Monthly change</td>
                { this.renderMonthlyChange() }
              </tr>
              <tr>
                <td>Monthly high</td>
                { this.renderMonthlyHigh() }
              </tr>
              <tr>
                <td>Monthly low</td>
                { this.renderMonthlyLow() }
              </tr>
              <tr>
                <td>Annual change</td>
                { this.renderYearlyChange() }
              </tr>
              <tr>
                <td>Annual high</td>
                { this.renderYearlyHigh() }
              </tr>
              <tr>
                <td>Annual low</td>
                { this.renderYearlyLow() }
              </tr>
            </tbody>
          </Table>
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
