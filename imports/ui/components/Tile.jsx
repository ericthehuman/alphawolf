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


export default class Tile extends Component {

  handleClickItem(itemVal){
    //re-renders tiles, need to somehow get itemVal
    console.log("something is pressed!\n" + itemVal);

    switch (itemVal) {
      case "consumer1":
          data.code = "consumer1";
          break;
      case "consumer2":
          data.code = "consumer2";
          break;
      case "energy":
          data.code = "energy";
          break;
      case "financial":
          data.code = "financial";
          break;
      case "health":
          data.code = "health";
          break;
      case "industrials":
          data.code = "industrials";
          break;
      case "it":
          data.code = "it";
          break;
      case "materials":
        data.code = "materials";
        break;
      case "metalmine":
        data.code = "metalmine";
        break;
      case "resource":
        data.code = "resource";
        break;
      case "telecom":
        data.code = "telecom";
        break;
      default:
        data.code = "Home";
        break;
      } 
  }

  //return a render page based on the catergory selected
  renderCat(catergory){
    //a really long string
    var returnHtml;
    //debugging statement:
    console.log("the category trying to be render is: "+ category);

    //another switch board:


    //returns a cat :D
    return returnHtml;
  }

  //converts raw api data into structure the graph component uses
  parseDataIntoGraph(result, news, announcements) {
    if(result != null) {
      // console.log(announcements);

  	  var array = result;
      var stockData = [];
      var newsData = [];
      var announcementData = [];

      // convert data for graphing on high stocks
      // format:
      // [[timestamp, stockValue], [timestamp, stockValue] ....]
      for (i = 0; i < array.length; i ++) {
        var datestr = array[i].Date;
        // console.log("DATESTR:" + datestr);
        datestr = datestr.split("/");
        var dd = parseInt(datestr[0]);
        var mm = parseInt(datestr[1])-1;
        var yyyy = parseInt(datestr[2]);
        var timestamp = Date.UTC(yyyy,mm,dd);
        // console.log("SPLIT:" + dd + "/" + mm + "/" + yyyy);

        stockData.push({ x: timestamp, y: array[i].Close });
      }

      console.log(news);
      // parse data for displaying news
      for (var j = 0; j < news.length; j++) {
        var currNewsItem = news[j];
        var newsDate = currNewsItem["date"];

        var datestr = newsDate.split("/");
        var dd = parseInt(datestr[0]);
        var mm = parseInt(datestr[1])-1;
        var yyyy = parseInt(datestr[2]);
        var timestamp = Date.UTC(yyyy,mm,dd);

        var newsExistsForDate = false;
        for (var k = 0; k < newsData.length; k++) {
          if (newsData[k].x === timestamp) {
            newsExistsForDate = true;
            break;
          }
        }

        if (newsExistsForDate) continue;

        var currNewsData = {  x: timestamp,
                              title: "",
                              style: { color: 'rgba(0,0,0,0)' },
                              text: "<b>Related news</b><br>" + currNewsItem.headline,
                              url: currNewsItem.url
                           };
        // console.log(currNewsData);
        newsData.push(currNewsData);
      }

      newsData.sort(function(a, b) {
          return parseFloat(a.x) - parseFloat(b.x);
      });

      // parse data for announcements
      for (var j = 0; j < announcements.length; j++) {
        // var currAnnouncement = announcements[j];
        console.log(announcements[j]);
        var date = announcements[j].date;

        var datestr = date.split("/");
        var dd = parseInt(datestr[0]);
        var mm = parseInt(datestr[1])-1;
        var yyyy = parseInt(datestr[2]);
        var timestamp = Date.UTC(yyyy,mm,dd);

        announcementData.push ({ x: timestamp,
                                 y: null,
                                 title: "",
                                 style: { color: 'rgba(0,0,0,0)' },
                                 text: "<b>Company announcement</b><br>" + announcements[j].title,
                                 url: announcements[j].url });
      }
      announcementData.sort(function(a, b) {
        return parseFloat(a.x) - parseFloat(b.x);
      });
      // console.log(announcementData);

      var chart = Highcharts.stockChart('container', {
        series: [
          // stock data graph
          {
            data: stockData,
            name: "Closing Price",
            id: "stockData"
          },
          // news data graph
          {
            type: 'flags',
            name: 'News',
            data: newsData,
            useHTML: true,
            shape: 'url(assets/news-icon2.png)', //'circlepin',
            events: { // upon click, it will launch another tab
              click: function (event) {
                console.log(event);
                event.preventDefault();
                window.open(event.point.url, '_blank');
              }
            },
            width: 14,
            y: 10, // position relative to graph
          },
          // announcement data graph
          {
            type: 'flags',
            name: 'Annnoucements',
            data: announcementData,
            onSeries: 'stockData',
            useHTML: true,
            shape: 'url(assets/announcement.png)',
            events: {
              click: function (event) {
                console.log(event);
                event.preventDefault();
                window.open(event.point.url, '_blank');
              }
            },
            width: 30,
            // states: { hover: { halo: { attributes: { fill: Highcharts.getOptions().colors[2], 'stroke-width': 1, stroke: Highcharts.getOptions().colors[1] }, opacity: 0.25, size: 10 } } } // leave here for future maybe
          },
          // set more options here for graph or more graph data
        ],
        // set title of graph
        title: {
          text: "Closing Price"
        },
        // set tooltip format
        tooltip: {
          style: {
            width: '250px',
            backgroundColor: '#FCFFC5',
            borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3
          }
        },
        // initial range selected
        rangeSelector: {
          selected: 1
        },
        // ... more options - see http://api.highcharts.com/highcharts
      });
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

    var data = this.props.stockData;
    console.log("PROS.STOCKDATA: ");
    console.log(data);
    //rendering news page here
    //value consponds to data code which will be used as a switch function
		if(data[0].code === "Home") {
  		return (
  			<div className="tile">
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Consumer Discretionary"} imagef={"http://www.sharesinv.com/wp-content/uploads/articles/consumer-ETFs.jpg"} value={"consumer1"}/>
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Consumer Staples"} imagef={"http://www.etftrends.com/wp-content/uploads/2012/10/consumer-staples-etfs.png"} value={"consumer2"}/>
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Energy"} imagef={"https://www.dentons.com/-/media/images/website/background-images/industry-sectors/energy/energy-2.jpg  "} value={"energy"}/>
  				<Item optionChange={this.handleClickItem.bind(this)} news={"Financial"} imagef={"http://static.memrise.com/uploads/course_photos/3146044000150629230223.jpg"} value={"financial"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Health Care"} imagef={"http://www.philips.com.au/c-dam/b2bhc/us/homepage-rebranded/specialties_heartmonitor.png"} value={"health"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Industrials"} imagef={"http://relaypowersystems.com/wp-content/uploads/2011/10/refinery.jpg"} value={"industrials"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"IT- Information Technology"} imagef={"https://i.ytimg.com/vi/GyfPJ1i1Y5Y/maxresdefault.jpg "} value={"it"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Materials"} imagef={"http://cambabest.co.uk/wp-content/uploads/2015/02/Building-banner1.jpg"} value={"materials"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Metals and Minning"} imagef={"http://rsb-industries.com/images/Metal_Mining.jpg"} value={"metalmine"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Resources"} imagef={"http://psychology.berkeley.edu/sites/default/files/styles/1000x400sc/public/Resources%20page%20photo_0.jpg?itok=dLdmH90P"} value={"resource"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Telecommunications Services"} imagef={"https://www.sevone.com/sites/default/files/images/telecommunications-map.jpg"} value={"telecom"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Utilities"} imagef={"http://allentownboronj.com/vertical/Sites/%7B7748EEEB-2391-4653-8B6A-4A64C85A6D79%7D/uploads/8329283_orig.jpg"} value={"util"}/>
          <Item optionChange={this.handleClickItem.bind(this)} news={"Banking"} imagef={"http://keravnoslaw.com/images/banking.jpg"} value={"bank"}/>
          </div>
  			);
		} else if (data.code === "consumer1"){
      //render consumer1 tile
      //make an all in one rendering function for shares
      return(renderCat(data.code));

    }else if (data.code === "consumer2"){
      //render consumer2 tiles
      return(renderCat(data.code));

    }else if (data.code === "energy"){
      //render energy tiles
      return(renderCat(data.code));

    }else if (data.code === "financial"){
      //render financial tiles
      return(renderCat(data.code));

    }else if (data.code === "health"){
      //render health tiles
      return(renderCat(data.code));

    }else if (data.code === "industrials"){
      //render industrials tiles
      return(renderCat(data.code));

    }else if (data.code === "it"){
      //render it tiles
      return(renderCat(data.code));

    }else if (data.code === "materials"){
      //render materials tiles
      return(renderCat(data.code));

    }else if (data.code === "metalmine"){
      //render metals and mining tiles
      return(renderCat(data.code));

    }else if (data.code === "resource"){
      //render resource tiles
      return(renderCat(data.code));

    }else if (data.code === "telecom"){
      //render telecommunication tiles
      return(renderCat(data.code));

    }else if (data.code === "util"){
      //render utilities tiles
      return(renderCat(data.code));

    }else if (data.code === "bank"){
      //render bank tiles
      return(renderCat(data.code));
    }else {
      var news = data[0].companyNews;
      this.parseDataIntoGraph(data[0].stock_data, news, data[0].announcements);
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

Tile.propTypes = {
  // This component gets the return figure to display through a React prop.
  // We can use propTypes to indicate it is required
  stockData: PropTypes.array.isRequired,
};
