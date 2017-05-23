import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import Item from './Item.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { Table, Form, Glyphicon, Tooltip as Toolitip, OverlayTrigger } from 'react-bootstrap';

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

var Highcharts = require('highcharts/highstock');


export default class Tile extends Component {

    renderCat(category) {

        if (category === "financial") {
            return(
              <div>
                <h2>Financials</h2>
                <h3>Top Stocks This Month</h3>
                <div className="sector-btn-container">
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="CBA">
                    <span className="item-text">Commonwealth Bank of Australia (CBA)</span>
                  </button>
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="WBC">
                    <span className="item-text">Westpac Banking Corporation (WBC)</span>
                  </button>
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="NAB">
                    <span className="item-text">National Australia Bank Limited (NAB)</span>
                  </button>
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ANZ">
                    <span className="item-text">Australia And New Zealand Banking Group Limited (ANZ)</span>
                  </button>
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BOQ">
                    <span className="item-text">Bank of Queensland Limited (BOQ)</span>
                  </button>
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BEN">
                    <span className="item-text">Bendigo And Adelaide Bank Limited (BEN)</span>
                  </button>
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="IAG">
                    <span className="item-text">Insurance Australia Group Limited (IAG)</span>
                  </button>
                  <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="GMA">
                    <span className="item-text">Genworth Mortgage Insurance Australia Limited (GMA)</span>
                  </button>
                </div>
                <h3>Top Headlines</h3>
                <Table>
                  <tbody>
                    { this.renderCurrentSectorNews() }
                  </tbody>
                </Table>
              </div>
            );
        } else if (category === "materials") {
          return(
            <div>
              <h2>Materials</h2>
              <h3>Top Stocks This Month</h3>
              <div className="sector-btn-container">
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BHP">
                  <span className="item-text">BHP Billiton Limited (BHP)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="RIO">
                  <span className="item-text">RIO Tinto Limited (RIO)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="OZL">
                  <span className="item-text">Oz Minerals Limited (OZL)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BSL">
                  <span className="item-text">Bluescope Steel Limited (BSL)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ORI">
                  <span className="item-text">Orica Limited (ORI)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="CSR">
                  <span className="item-text">CSR Limited (CSR)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="EVN">
                  <span className="item-text">Evolution Mining Limited (EVN)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ABC">
                  <span className="item-text">Adelaide Brighton Limited (ABC)</span>
                </button>
              </div>
              <h3>Top Headlines</h3>
              <Table>
                <tbody>
                  { this.renderCurrentSectorNews() }
                </tbody>
              </Table>
            </div>
          );
        } else if (category === "consumer2") {
          return(
            <div>
              <h2>Consumer Staples</h2>
              <h3>Top Stocks This Month</h3>
              <div className="sector-btn-container">
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="CBA">
                  <span className="item-text">Commonwealth Bank of Australia (CBA)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="WBC">
                  <span className="item-text">Westpac Banking Corporation (WBC)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="NAB">
                  <span className="item-text">National Australia Bank Limited (NAB)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ANZ">
                  <span className="item-text">Australia And New Zealand Banking Group Limited (ANZ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BOQ">
                  <span className="item-text">Bank of Queensland Limited (BOQ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BEN">
                  <span className="item-text">Bendigo And Adelaide Bank Limited (BEN)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="IAG">
                  <span className="item-text">Insurance Australia Group Limited (IAG)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="MQG">
                  <span className="item-text">Macquarie Group Limited (MQG)</span>
                </button>
              </div>
            </div>
          );
        } else if (category === "energy") {
          return(
            <div>
              <h2>Energy</h2>
              <h3>Top Stocks This Month</h3>
              <div className="sector-btn-container">
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="CBA">
                  <span className="item-text">Commonwealth Bank of Australia (CBA)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="WBC">
                  <span className="item-text">Westpac Banking Corporation (WBC)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="NAB">
                  <span className="item-text">National Australia Bank Limited (NAB)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ANZ">
                  <span className="item-text">Australia And New Zealand Banking Group Limited (ANZ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BOQ">
                  <span className="item-text">Bank of Queensland Limited (BOQ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BEN">
                  <span className="item-text">Bendigo And Adelaide Bank Limited (BEN)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="IAG">
                  <span className="item-text">Insurance Australia Group Limited (IAG)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="MQG">
                  <span className="item-text">Macquarie Group Limited (MQG)</span>
                </button>
              </div>
            </div>
          );
        } else if (category === "industrials") {
          return(
            <div>
              <h2>Industrials</h2>
              <h3>Top Stocks This Month</h3>
              <div className="sector-btn-container">
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="CBA">
                  <span className="item-text">Commonwealth Bank of Australia (CBA)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="WBC">
                  <span className="item-text">Westpac Banking Corporation (WBC)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="NAB">
                  <span className="item-text">National Australia Bank Limited (NAB)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ANZ">
                  <span className="item-text">Australia And New Zealand Banking Group Limited (ANZ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BOQ">
                  <span className="item-text">Bank of Queensland Limited (BOQ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BEN">
                  <span className="item-text">Bendigo And Adelaide Bank Limited (BEN)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="IAG">
                  <span className="item-text">Insurance Australia Group Limited (IAG)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="MQG">
                  <span className="item-text">Macquarie Group Limited (MQG)</span>
                </button>
              </div>
            </div>
          );
        } else if (category === "it") {
          return(
            <div>
              <h2>Information Technology</h2>
              <h3>Top Stocks This Month</h3>
              <div className="sector-btn-container">
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="CBA">
                  <span className="item-text">Commonwealth Bank of Australia (CBA)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="WBC">
                  <span className="item-text">Westpac Banking Corporation (WBC)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="NAB">
                  <span className="item-text">National Australia Bank Limited (NAB)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ANZ">
                  <span className="item-text">Australia And New Zealand Banking Group Limited (ANZ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BOQ">
                  <span className="item-text">Bank of Queensland Limited (BOQ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BEN">
                  <span className="item-text">Bendigo And Adelaide Bank Limited (BEN)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="IAG">
                  <span className="item-text">Insurance Australia Group Limited (IAG)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="MQG">
                  <span className="item-text">Macquarie Group Limited (MQG)</span>
                </button>
              </div>
            </div>
          );
        } else if (category === "util") {
          return(
            <div>
              <h2>Utilities</h2>
              <h3>Top Stocks This Month</h3>
              <div className="sector-btn-container">
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="CBA">
                  <span className="item-text">Commonwealth Bank of Australia (CBA)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="WBC">
                  <span className="item-text">Westpac Banking Corporation (WBC)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="NAB">
                  <span className="item-text">National Australia Bank Limited (NAB)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="ANZ">
                  <span className="item-text">Australia And New Zealand Banking Group Limited (ANZ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BOQ">
                  <span className="item-text">Bank of Queensland Limited (BOQ)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="BEN">
                  <span className="item-text">Bendigo And Adelaide Bank Limited (BEN)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="IAG">
                  <span className="item-text">Insurance Australia Group Limited (IAG)</span>
                </button>
                <button type="button" className="sector-stock" onClick={this.props.sectorAddFunction} value="MQG">
                  <span className="item-text">Macquarie Group Limited (MQG)</span>
                </button>
              </div>
            </div>
          );
        } else if (category === "tutorial") {
          return (

              <p>
                <h2>Beginners guide to the Stock Market</h2>
                <b>Welcome to Investing Basics!</b> If you've found your way here, chances are you've either got some money socked away or you're planning to do so. But first things first. Why is investing a smart idea?

                <br /><br />
                Simply put, you want to invest in order to create wealth. It's relatively painless, and the rewards are plentiful. By investing in the stock market, you'll have a lot more money for things like retirement, education, recreation -- or you could pass on your riches to the next generation so that you become your family's Most Cherished Ancestor. Whether you're starting from scratch or have a few thousand dollars saved, Investing Basics will help get you going on the road to financial (and Foolish!) well-being.

                <br /><br />
                It can be very challenging for someone who does not understand the financial lingo to confidently asses and make investments based on data that they do not understand. Thats where COWS comes in. A revolutionary new website, redefining how a stocks portfolio should look.

                <br />
                <h3>Buying shares on a share exchange</h3>
                There are five public share exchanges in Australia. Four of them directly supervise the companies that issue the shares that trade on their markets. The fifth exchange, Chi-X, currently only provides the infrastructure for trading shares already quoted on the ASX.
                <br /><br />
                The five exchanges are:
                <ul>
                  <li><a href="http://www.asx.com.au">Australian Securities Exchange (ASX)</a> - the main stock exchange in Australia</li>
                  <li><a href="http://www.chi-x.com.au">Chi-X</a> - an exchange that trades company shares already quoted on the ASX, but does not list or supervise the companies</li>
                  <li><a href="http://www.nsxa.com.au">National Stock Exchange of Australia (NSXA)</a> - a securities exchange that lists about 70 small to medium sized companies</li>
                  <li><a href="http://simvse.com.au">SIM Venture Securities Exchange (SIM VSE)</a> - an exchange for innovative companies involved in the clean technology, renewable energy and bio science field</li>
                  <li><a href="http://www.apx.com.au/APX/Public/EN/Default.aspx">Asia Pacific Stock Exchange (APX)</a> - a stock exchange with a focus on growth oriented companies from the Asia-Pacific region</li>
                </ul>
                To start buying and selling shares on any of these exchanges, simply visit their link.

                <br />
                <h3>Reading a COWS stocks sheet</h3>
                The COWS stocks page list only the crucial information needed to invest in stocks. We leave out the unimportant and irrelevant data. Below is a guide as to what each piece of information means, and how it should affect your investment decisions.
                <ul>
                  <li><strong>Stock Code</strong>: An abbreviation used to uniquely identify publicly traded shares of a particular stock on a particular stock market</li>
                  <li><strong>Sector</strong>: The sector of the stock defines the industry that the company is mostly involved in. Sector analysis provides the investor with an idea of how well a group of companies in the same sector could be expected to perform as a whole. Generally, a group of stocks within a sector tend to move together because companies within the same industry group are affected in similar ways by market and economic conditions.</li>
                  <li><strong>Summary</strong>: A general company description. It is advisable to research/invest instocks that you can understand their business model.</li>
                  <li><strong>Close</strong>: The closing price is the final price at which a stock is traded on a given trading day. The closing price represents the most up-to-date valuation of a security until trading commences again on the next trading day. Although closing prices do not reflect the after-hours price or corporate actions, they may still act as useful markers for investors to assess changes in stock prices over time — the closing price of one day can be compared to the previous closing price to measure market sentiment for a given security over a trading day</li>
                  <li><strong>Previous Close</strong>: The stock's closing price on the preceding day of trading.</li>
                  <li><strong>Monthly Change</strong>: Monthly change is the difference between the closing price of a stock on the day's trading and the previous month's closing price. It shows the companies performance over the past month and provides a short term illustration of the companies performance.</li>
                  <li><strong>Monthly High</strong>: The highest price that the stock has traded at in the previous month. This can give an indication of the possible future benefits of the stock.</li>
                  <li><strong>Monthly Low</strong>: The lowest price that the stock has traded at in the previous month. This can give an indication of the possible future flaws of the stock. </li>
                  <li><strong>Annual Change</strong>: Annual change is the difference between the closing price of a stock on the day's trading and the previous year's closing price. It shows the companies performance over the past year and provides a long term illustration of the companies performance.</li>
                  <li><strong>Annual High</strong>: The highest price that the stock has traded at in the previous year. This can give an indication of the possible future benefits of the stock.</li>
                  <li><strong>Annual Low</strong>: The lowest price that the stock has traded at in the previous year. This can give an indication of the possible future flaws of the stock. </li>

                </ul>
              </p>
          );
        }
    }


/** PARSE DATA STUFF **/


  parseDataIntoPercentGraphTwo(company1,company2) {
    //console.log("herere");
    if ((company1 != null) && (company2 != null)) {
      // console.log(result);
      // console.log("NEWS: " + JSON.stringify(news));
      // console.log(section);

      var array1 = company1.stock_data;
      var array2 = company2.stock_data;

      var stockData1 = [];
      var stockData2 = [];

      var newsData = [];
      var announcementData = [];
      var returns = []
      // convert data for graphing on high stocks
      // format:
      // [[timestamp, stockValue], [timestamp, stockValue] ....]


      for (i = 0; i < array1.length; i ++) {
        var datestr = array1[i].Date;
        // console.log("DATESTR:" + datestr);
        datestr = datestr.split("/");
        var dd = parseInt(datestr[0]);
        var mm = parseInt(datestr[1])-1;
        var yyyy = parseInt(datestr[2]);
        var timestamp = Date.UTC(yyyy,mm,dd);
        // console.log("SPLIT:" + dd + "/" + mm + "/" + yyyy);
        if (i == 0) {
          returns[i] = 0;

        } else {

          returns[i] = Math.round((100 * (array1[i].Close - array1[i-1].Close)/array1[i-1].Close)*100)/100;

        }

        stockData1.push({ x: timestamp, y: returns[i] });
      }





      for (i = 0; i < array2.length; i ++) {
        var datestr = array2[i].Date;
        // console.log("DATESTR:" + datestr);
        datestr = datestr.split("/");
        var dd = parseInt(datestr[0]);
        var mm = parseInt(datestr[1])-1;
        var yyyy = parseInt(datestr[2]);
        var timestamp = Date.UTC(yyyy,mm,dd);
        // console.log("SPLIT:" + dd + "/" + mm + "/" + yyyy);
        if (i == 0) {
          returns[i] = 0;

        } else {

          returns[i] = Math.round((100 * (array2[i].Close - array2[i-1].Close)/array2[i-1].Close)*100)/100;

        }

        stockData2.push({ x: timestamp, y: returns[i] });
      }




      console.log("here");

      var chart = Highcharts.stockChart('container2', {
        series: [
          // stock data graph
          {
            data: stockData1,
            name: "Percentage Returns: " + company1.code,
            id: "stockData1",
            color: "#6AA5E7"
          },
          {
            data: stockData2,
            name: "Percentage Returns: " + company2.code,
            id: "stockData2",
            color: "#F3924A"
          },

          // set more options here for graph or more graph data
        ],
        // set title of graph
        title: {
          text: "Daily Percentage Returns",
          style: {
            'font-weight': 'bold',
            // 'color': "#7cb5ec"
          }
        },
        // set tooltip format
        tooltip: {
          style: {
            width: '250px',
            backgroundColor: '#FCFFC5',
            // borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3
          },
        },
        // initial range selected
        rangeSelector: {
          selected: 1
        },
        // scrollbar: {
        //   enabled: false
        // },
        chart: {
          backgroundColor: "#f5f5f5",
          borderColor: "#c4c4c4",
          borderWidth: 2,
          borderRadius: 2,
        },
        yAxis: {
          title: {
            text: '%',
            enabled: true,
            style: {
              'font-weight': 'bold',
              'color': "#7cb5ec"
            }
          },
        },
        legend: {
          layout: 'horizontal',
          enabled: true,
          // borderRadius: 5,
          // borderWidth: 1,
          // borderColor: 'darkgrey'
        },
        // ... more options - see http://api.highcharts.com/highcharts
      });
    }
  }







  parseDataIntoPercentGraph(result) {
    //console.log("herere");
    if(result != null) {
      console.log("ANNOUNCEMENTS");
      // console.log(result);
      // console.log("NEWS: " + JSON.stringify(news));
      // console.log(section);

      var array = result;
      var stockData = [];
      var newsData = [];
      var announcementData = [];
      var returns = []
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
        if (i == 0) {
          returns[i] = 0;

        } else {

          returns[i] = Math.round((100 * (array[i].Close - array[i-1].Close)/array[i-1].Close)*100)/100;

        }

        stockData.push({ x: timestamp, y: returns[i] });
      }



      console.log("here");

      var chart = Highcharts.stockChart('container2', {
        series: [
          // stock data graph
          {
            data: stockData,
            name: "Percentage Returns",
            id: "stockData",
            color: "#6AA5E7"
          },


          // set more options here for graph or more graph data
        ],
        // set title of graph
        title: {
          text: "Daily Percentage Returns",
          style: {
            'font-weight': 'bold',
            // 'color': "#7cb5ec"
          }
        },
        // set tooltip format
        tooltip: {
          style: {
            width: '250px',
            backgroundColor: '#FCFFC5',
            // borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3
          },
        },
        // initial range selected
        rangeSelector: {
          selected: 1
        },
        // scrollbar: {
        //   enabled: false
        // },
        chart: {
          backgroundColor: "#f5f5f5",
          borderColor: "#c4c4c4",
          borderWidth: 2,
          borderRadius: 2,
          height: 300
        },
        yAxis: {
          title: {
            text: '%',
            enabled: true,
            style: {
              'font-weight': 'bold',
              'color': "#7cb5ec"
            }
          },
        },
        legend: {
          layout: 'horizontal',
          enabled: true,
          // borderRadius: 5,
          // borderWidth: 1,
          // borderColor: 'darkgrey'
        },
        // ... more options - see http://api.highcharts.com/highcharts
      });
    }
  }


























  //converts raw api data into structure the graph component uses
    parseDataIntoGraph(num, company1, company2) {
        console.log("SHOWING DATA FOR RESULT FOR " + num);
        // console.log(company1);
        var series = []; // data series to attach to graph

        if (num == 2) {
            parseData(company1, function (stocks, news, announcements) {
                addToSeriesSet(series, 1, company1.code, stocks, news, announcements, function(result){
                    parseData(company2, function (stocks2, news2, announcements2) {
                        addToSeriesSet(series, 2, company2.code, stocks2, news2, announcements2, drawGraph);
                    });
                });
            });
        } else {
            // var dividends = company1.dividends; // for future
            parseData(company1, function (stocks, news, announcements) {
                addToSeriesSet(series, 1, company1.code, stocks, news, announcements, drawGraph);
            });
        }

        function parseData(company, callback) {
            console.log("PARSE STOCKS");
            var stocks = company.stock_data;
            var news = company.companyNews;
            var announcements = company.announcements;

            var stockData = [];
            var newsData = [];
            var announcementData = [];

            for (var i = 0; i < stocks.length; i ++) {
                var date = stocks[i].Date.split("/");
                var timestamp = Date.UTC(date[2], date[1]-1, date[0]);
                stockData.push({ x: timestamp, y: stocks[i].Close });
            }

            if (news !== undefined) {
                for (var j = 0; j < news.length; j++) {
                    var date = news[j].date.split("/");
                    var timestamp = Date.UTC(date[2], date[1]-1, date[0]);

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
                        style: {
                            color: 'rgba(0,0,0,0)',
                            borderColor: "#FA6C61",
                        },
                        text: "<b>Related news</b><br>" + news[j].headline + "<br>" +
                        "<span class='tooltip-link'><i>Click to read more!</i></span>",
                        url: news[j].url
                    };
                    newsData.push(currNewsData);
                    if (newsData.length === 25) break; // max 25 news
                }
                newsData.sort(function(a, b) {
                    return parseFloat(a.x) - parseFloat(b.x);
                });

            }

            // parse data for announcements
            for (var j = 0; j < announcements.length; j++) {
                var date = announcements[j].date.split("/");
                var timestamp = Date.UTC(date[2], date[1]-1, date[0]);
                var oldestTime = Date.UTC(2016, 3, 10);
                // Ignore announcements outside of graph range
                if (timestamp < oldestTime) continue;

                announcementData.push ({  x: timestamp,
                    y: null,
                    title: "",
                    style: { color: 'rgba(0,0,0,0)' },
                    text: "<b>Company announcement</b><br>" + announcements[j].title + "<br>" +
                    "<span class='tooltip-link'><i>Click to read more!</i></span>",
                    url: announcements[j].url
                });
            }
            announcementData.sort(function(a, b) {
                return parseFloat(a.x) - parseFloat(b.x);
            });

            // finished parsing, call return function with the results
            callback(stockData, newsData, announcementData);
        }

        function addToSeriesSet(series, num, companyCode, stocks, news, announcements, callback) {
            series.push({
                data: stocks,
                name: "Closing Price ("+companyCode+")",
                id: companyCode
            });
            series.push({
                type: 'flags',
                name: 'Company News ('+companyCode+')',
                data: news,
                useHTML: true,
                shape: 'url(assets/news'+num+'.png)', //'circlepin',
                events: { // upon click, it will launch another tab
                    click: function (event) {
                        console.log(event);
                        event.preventDefault();
                        window.open(event.point.url, '_blank');
                    }
                },
                width: 30,
                y: -30, // position relative to y-axis
            });
            series.push({
                type: 'flags',
                name: 'Annnoucements ('+companyCode+')',
                data: announcements,
                onSeries: companyCode,
                useHTML: true,
                shape: 'url(assets/announcement'+num+'.png)',
                events: {
                    click: function (event) {
                        // console.log(event);
                        event.preventDefault();
                        window.open(event.point.url, '_blank');
                    }
                },
                width: 30,
                // states: { hover: { halo: { attributes: { fill: Highcharts.getOptions().colors[2], 'stroke-width': 1, stroke: Highcharts.getOptions().colors[1] }, opacity: 0.25, size: 10 } } } // leave here for future maybe
            });

            callback(series);
        }

        function drawGraph(series){
            var chart = Highcharts.stockChart('container', {
                series: series,
                // set title of graph
                title: {
                    text: "Closing Price",
                    style: {
                        'font-weight': 'bold',
                        // 'color': "#7cb5ec"
                    }
                },
                // set tooltip format
                tooltip: {
                    style: {
                        width: '250px',
                        backgroundColor: '#FCFFC5',
                        // borderColor: 'black',
                        borderRadius: 10,
                        borderWidth: 3
                    },
                },
                // initial range selected
                rangeSelector: {
                    selected: 1
                },
                // scrollbar: {
                //   enabled: false
                // },
                chart: {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#c4c4c4",
                    borderWidth: 2,
                    borderRadius: 2,
                    height: 480
                },
                yAxis: {
                    title: {
                        text: '$AU',
                        enabled: true,
                        style: {
                            'font-weight': 'bold',
                            'color': "#7cb5ec"
                        }
                    },
                },
                legend: {
                    layout: 'horizontal',
                    enabled: true,
                    // borderRadius: 5,
                    // borderWidth: 1,
                    // borderColor: 'darkgrey'
                },
                // ... more options - see http://api.highcharts.com/highcharts
            });
            // console.log("IS THE BLOODY GRAPH DRAWN YET?");
        }
    }

    renderStocksName() {
        return this.props.stockData.map((data, i, stockData) => {
            if (data.name === "Company") {
                const tooltip_ticker = (
                    <Toolitip id="tooltip"><strong>ASX Code</strong><br />An abbreviation used to uniquely identify publicly traded shares in Australian Stock Exchange of a particular company</Toolitip>
                    //<font size="2"><OverlayTrigger placement="top" overlay={tooltip_ticker}><Glyphicon glyph="info-sign" /></OverlayTrigger></font>
                );
                return (<td className="small-col add-borders align-center"><h1>{ data.name }<font size="2"><OverlayTrigger placement="top" overlay={tooltip_ticker}><Glyphicon glyph="info-sign" /></OverlayTrigger></font></h1></td>);
            }

            var companySector = data.sector;

            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="equal-col align-right"><h1>{data.name} <span className="stock-code">({data.code})</span></h1></td>);
                } else {
                    return (<td className="equal-col"><h1>{data.name} <span className="stock-code">({data.code})</span></h1></td>);
                }
            } else {
                return (<td><h1>{data.name} <span className="stock-code">({data.code})</span></h1></td>);
            }

        })
    }

    renderStocksSector() {
        return this.props.stockData.map((data, i, stockData) => {
            if (!data.sector) data.sector = "Unknown sector";
            var tooltip = (
                <Toolitip id="tooltip"><strong>Company sector</strong><br />The business sector or corporate sector that this company operates in the economy</Toolitip>
            );
            if (data.sector === "Sector") {
                return (<td className="align-center add-borders"><b>{data.sector }</b> <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger></td>);
            }
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="align-right">{data.sector}</td>);
                }
            }
            return (<td>{data.sector}</td>);
        })
    }

    renderStocksDescription() {
        return this.props.stockData.map((data, i, stockData) => {
            if (!data.short_description) data.short_description = "No description available.";
            var tooltip = (
                <Toolitip id="tooltip"><strong>Company activities</strong><br />The main activities that this company engages in</Toolitip>
            );

            if (data.short_description === "Summary") {
                return (<td className="align-center add-borders"><b>{data.short_description}</b> <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger></td>);
            }
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="align-right">{data.short_description}</td>);
                }
            }
            return (<td>{data.short_description}</td>);
        })
    }

    renderStocksUrl() {
        return this.props.stockData.map((data, i, stockData) => {
            if (!data.url) {
                return (<td>No website URL available</td>);
            }
            if (data.url === "Company Website") {
                return (<td className="align-center add-borders"><b>{data.url}</b></td>);
            }
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="align-right"><a href={data.url}>{data.url}</a></td>);
                }
            }
            return (<td><a href={data.url}>{data.url}</a></td>);
        })
    }

    renderStocksPhone() {
        return this.props.stockData.map((data, i, stockData) => {
            if (!data.phone) data.phone = "No phone no. available."
            if (data.phone === "Phone no.") {
                return (<td className="align-center add-borders"><b>{data.phone}</b></td>);
            }
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="align-right">{data.phone}</td>);
                }
            }
            return (<td>{data.phone}</td>);
        })
    }

    renderStocksClose() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Close</strong><br /><div align="left">This is the last trading price recorded when the market closed on the day</div></Toolitip>);

            if (data.yesterdayClose) {
                return (<td className="align-center add-borders"><h2><b>{data.yesterdayClose + " "}</b><OverlayTrigger placement="top" overlay={tooltip}><font size="2"><Glyphicon glyph="info-sign" /></font></OverlayTrigger></h2></td>);
            }

            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;

            var currClose = companyReturns[NUMDAYS].Close;
            var prevClose = companyReturns[NUMDAYS-1].Close;
            var positiveSignDay = (companyReturns[NUMDAYS].Close-companyReturns[NUMDAYS-1].Close) >= 0 ? "+" : "";

            // const tooltip_close = (
            //     <Toolitip id="tooltip"><strong>$Close, Change in Price, % Change in price </strong><br /><div align="left">Close: The close is the last trading price recorded when the market closed on the day<br />Change: the dollar value change in the stock price from the previous day's closing price<br />% Change: The percentage change from yesterday's closing price</div></Toolitip>
            //     //<font size="2"><OverlayTrigger placement="top" overlay={tooltip_ticker}><Glyphicon glyph="info-sign" /></OverlayTrigger></font>
            // );
            var tooltip_change = (<Toolitip id="tooltip"><strong>Change in price</strong><br /><div align="left">The dollar value change in the stock price from the previous day's closing price</div></Toolitip>);
            var tooltip_pchange = (<Toolitip id="tooltip"><strong>Percentage change in price </strong><br /><div align="left">The change in the stock price calculated as a percentage of the previous day's closing price</div></Toolitip>);

            if (stockData.length === 3) {
                if (i === 0) {
                    return (
                        <td className="align-right"><h2><b>
                          <span>${parseFloat(currClose).toFixed(2)}</span>
                          <OverlayTrigger placement="top" overlay={tooltip_change}><span className={positiveSignDay === "+" ? "stock-positive" : "stock-negative"}>{" " + positiveSignDay}
                              {parseFloat(currClose-prevClose).toFixed(2) + " "}</span></OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={tooltip_pchange}><span className={positiveSignDay === "+" ? "stock-positive" : "stock-negative"}>
                ({positiveSignDay}{parseFloat((currClose-prevClose)/prevClose*100).toFixed(2)}%)</span></OverlayTrigger>
                        </b></h2></td>
                    );
                }
            }
            return (
                <td><h2><b>
                  <span>${parseFloat(currClose).toFixed(2)}</span>
                  <OverlayTrigger placement="top" overlay={tooltip_change}><span className={positiveSignDay === "+" ? "stock-positive" : "stock-negative"}>{" " + positiveSignDay}
                      {parseFloat(currClose-prevClose).toFixed(2) + " "}</span></OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={tooltip_pchange}><span className={positiveSignDay === "+" ? "stock-positive" : "stock-negative"}>
            ({positiveSignDay}{parseFloat((currClose-prevClose)/prevClose*100).toFixed(2)}%)</span></OverlayTrigger>
                </b></h2></td>
            );
        });
    }

    renderPreviousClose() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Previous close</strong><br /><div align="left">A security's closing price on the preceding day of trading</div></Toolitip>);
            if (data.prevClose) {
                return (<td className="small-col align-center">{data.prevClose + " "} <br /> <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger></td>);
            }

            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;
            var prevClose = companyReturns[NUMDAYS-1].Close;
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="equal-col align-right"><b>${parseFloat(prevClose).toFixed(2)}</b></td>);
                }
            }
            return (<td><b>${parseFloat(prevClose).toFixed(2)}</b></td>)
        })
    }

    renderMonthlyChange() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Monthly change</strong><br /><div align="left">Difference in price between the last closing price and the closing price a month ago</div></Toolitip>);
            if (data.monthlyChange) {
                return (<td className="align-center">{ data.monthlyChange + " " }<br />  <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger></td>);
            }
            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;
            var monthBefore = Math.max(NUMDAYS-30, 0);

            var currClose = companyReturns[NUMDAYS].Close;
            var positiveSignMonth = (companyReturns[NUMDAYS].Close-companyReturns[monthBefore].Close) >= 0 ? "+" : "";
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className={positiveSignMonth === "+" ? "stock-positive align-right" : "stock-negative align-right"}><b>${parseFloat(currClose-companyReturns[monthBefore].Close).toFixed(2)}{' '}
                      ({positiveSignMonth}{parseFloat((currClose-companyReturns[monthBefore].Close)/companyReturns[monthBefore].Close*100).toFixed(2)}%)</b></td>);
                }
            }
            return (<td className={positiveSignMonth === "+" ? "stock-positive" : "stock-negative"}><b>{parseFloat(currClose-companyReturns[monthBefore].Close).toFixed(2)}{' '}
              ({positiveSignMonth}{parseFloat((currClose-companyReturns[monthBefore].Close)/companyReturns[monthBefore].Close*100).toFixed(2)}%)</b></td>)
        })
    }

    renderMonthlyHigh() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Monthly high</strong><br /><div align="left">The highest intra-day price during the preceding month</div></Toolitip>);
            if (data.monthlyHigh) {
                return (<td className="align-center">{ data.monthlyHigh + " " } <br />  <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger></td>);
            }
            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;
            var monthBefore = Math.max(NUMDAYS-30, 0);
            var highestCloseMonth = parseFloat(companyReturns[monthBefore].Close);

            for (var j = monthBefore; j < companyReturns.length; j++) {
                var compareClose = parseFloat(companyReturns[j].Close);
                // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
                if (compareClose > highestCloseMonth) highestCloseMonth = compareClose;
            }

            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="align-right"><b>${parseFloat(highestCloseMonth).toFixed(2)}</b></td>);
                }
            }
            return (<td><b>${parseFloat(highestCloseMonth).toFixed(2)}</b></td>)
        })
    }

    renderMonthlyLow() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Monthly low</strong><br /><div align="left">The lowest intra-day price during the preceding month</div></Toolitip>);
            if (data.monthlyLow) {
                return (<td className="align-center">{ data.monthlyLow + " " }<br /> <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger></td>);
            }
            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;
            var monthBefore = Math.max(NUMDAYS-30, 0);
            var lowestCloseMonth = parseFloat(companyReturns[monthBefore].Close);

            for (var j = monthBefore; j < companyReturns.length; j++) {
                var compareClose = parseFloat(companyReturns[j].Close);
                // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
                if (compareClose < lowestCloseMonth) lowestCloseMonth = compareClose;
            }
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="align-right"><b>${parseFloat(lowestCloseMonth).toFixed(2)}</b></td>);
                }
            }
            return (<td><b>${parseFloat(lowestCloseMonth).toFixed(2)}</b></td>)
        })
    }

    renderYearlyChange() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Annual change</strong><br /><div align="left">Difference in price between the last closing price and the closing price a year ago</div></Toolitip>);
            if (data.annualChange) {
                return (<td className="align-center">{ data.annualChange + " " } <br /> <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger> </td>);
            }
            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;
            var yearBefore = Math.max(NUMDAYS-365, 0);

            var currClose = companyReturns[NUMDAYS].Close;
            var positiveSignAnnual = (companyReturns[NUMDAYS].Close-companyReturns[yearBefore].Close) >= 0 ? "+" : "";
            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className={positiveSignAnnual === "+" ? "stock-positive align-right" : "stock-negative align-right"}><b>{parseFloat(currClose-companyReturns[yearBefore].Close).toFixed(2)}{' '}
                      ({positiveSignAnnual}{parseFloat((currClose-companyReturns[yearBefore].Close)/companyReturns[yearBefore].Close*100).toFixed(2)}%)</b></td>);
                }
            }
            return (<td className={positiveSignAnnual === "+" ? "stock-positive" : "stock-negative"}><b>{parseFloat(currClose-companyReturns[yearBefore].Close).toFixed(2)}{' '}
              ({positiveSignAnnual}{parseFloat((currClose-companyReturns[yearBefore].Close)/companyReturns[yearBefore].Close*100).toFixed(2)}%)</b></td>);

        })
    }

    renderYearlyHigh() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Yearly high</strong><br /><div align="left">The highest intra-day price during the preceding 52 weeks</div></Toolitip>);
            if (data.annualHigh) {
                return (<td className="align-center">{ data.annualHigh + " " } <br /> <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger> </td>);
            }
            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;
            var yearBefore = Math.max(NUMDAYS-365, 0);
            var highestCloseYear = parseFloat(companyReturns[yearBefore].Close);

            for (var j = yearBefore; j < companyReturns.length; j++) {
                var compareClose = parseFloat(companyReturns[j].Close);
                // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
                if (compareClose > highestCloseYear) highestCloseYear = compareClose;
            }

            if (stockData.length === 3) {
                if (i === 0) {
                    return (<td className="align-right"><b>${parseFloat(highestCloseYear).toFixed(2)}</b></td>);
                }
            }
            return (<td><b>${parseFloat(highestCloseYear).toFixed(2)}</b></td>);
        })
    }

    renderYearlyLow() {
        return this.props.stockData.map((data, i, stockData) => {
            var tooltip = (
                <Toolitip id="tooltip"><strong>Yearly low</strong><br /><div align="left">The lowest intra-day price during the preceding 52 weeks</div></Toolitip>);
            if (data.annualLow) {
                return (<td className="align-center">{ data.annualLow + " " } <br /> <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon glyph="info-sign" /></OverlayTrigger> </td>);
            }
            var companyReturns = data.stock_data;
            var NUMDAYS = companyReturns.length-1;
            var yearBefore = Math.max(NUMDAYS-365, 0);
            var lowestCloseYear = parseFloat(companyReturns[yearBefore].Close);

            for (var j = yearBefore; j < companyReturns.length; j++) {
                var compareClose = parseFloat(companyReturns[j].Close);
                // console.log("Curr: " + compareClose + " | high: " + highestCloseAnnual + " | low: " + lowestCloseAnnual + " | typeof(high): " + typeof(highestCloseAnnual));
                if (compareClose < lowestCloseYear) lowestCloseYear = compareClose;
            }
            if (stockData.length === 3) {
                if (i === 0) {
                    console.log("This should work");
                    return (<td className="align-right"><b>${parseFloat(lowestCloseYear).toFixed(2)}</b></td>);
                }
            }
            return (<td><b>${parseFloat(lowestCloseYear).toFixed(2)}</b></td>);
        })
    }


    renderCurrentSectorNews() {
        return this.props.stockData[0].news.map((data, i, stockData) => {
            return (<tr className="sector-news"><td className="thirty-col"><i>{data.date}</i></td><td><b><a href={data.url}>{data.headline}</a></b></td></tr>);
        })
    }


    render() {

      // Destroy any old charts
      // console.log("CHARTS:");
      // console.log(Highcharts.charts);
      for (var i = 0; i < Highcharts.charts.length; i++) {
        if (Highcharts.charts[i]) {
          console.log("Destroying chart");
          var chart = Highcharts.charts[i];
          chart.destroy();
        }
      }

        var data = this.props.stockData;

        //value consponds to data code which will be used as a switch function
        if(data[0].code === "Home") {
            return (
                <div className="invis-tile">
                  <Item optionChange={this.props.onChange} news={"Tutorial"} imagef={"http://keravnoslaw.com/images/banking.jpg"} value={"tutorial"}/>
                  <Item optionChange={this.props.onChange} news={"Financials"} imagef={"http://static.memrise.com/uploads/course_photos/3146044000150629230223.jpg"} value={"financial"}/>
                  <Item optionChange={this.props.onChange} news={"Consumer Staples"} imagef={"http://www.etftrends.com/wp-content/uploads/2012/10/consumer-staples-etfs.png"} value={"consumer2"}/>
                  <Item optionChange={this.props.onChange} news={"Energy"} imagef={"https://www.dentons.com/-/media/images/website/background-images/industry-sectors/energy/energy-2.jpg  "} value={"energy"}/>
                  <Item optionChange={this.props.onChange} news={"Industrials"} imagef={"http://relaypowersystems.com/wp-content/uploads/2011/10/refinery.jpg"} value={"industrials"}/>
                  <Item optionChange={this.props.onChange} news={"Information Technology"} imagef={"https://i.ytimg.com/vi/GyfPJ1i1Y5Y/maxresdefault.jpg "} value={"it"}/>
                  <Item optionChange={this.props.onChange} news={"Materials"} imagef={"http://cambabest.co.uk/wp-content/uploads/2015/02/Building-banner1.jpg"} value={"materials"}/>
                  <Item optionChange={this.props.onChange} news={"Utilities"} imagef={"http://allentownboronj.com/vertical/Sites/%7B7748EEEB-2391-4653-8B6A-4A64C85A6D79%7D/uploads/8329283_orig.jpg"} value={"util"}/>

                </div>
            );
        }else if (data[0].code === "tutorial" || data[0].code === "energy" || data[0].code === "consumer2" ||
                  data[0].code === "util" || data[0].code === "financial" || data[0].code === "industrials" ||
                  data[0].code === "it" || data[0].code === "materials") {
            return(this.renderCat(data[0].code));
        } else {
            console.log("WHAT IS THIS DATA");
            console.log(data);
            if (data[0].code === "dontshowthisever") {
                this.parseDataIntoGraph(1, data[1], null);
                this.parseDataIntoPercentGraph(data[1].stock_data);

            } else {
                // graph with two companies
                this.parseDataIntoGraph(2, data[0], data[2]);
                this.parseDataIntoPercentGraphTwo(data[0],data[2]);
            }

            var columnSpan = data.length+1;
            if (data.length === 3) {
                console.log("Got 2 stocks");
            } else if (data.length === 2) {
                console.log("Got 1 stock");
            }
            return (
                <div className="tile">
                  <Table className="borderless">
                    <tbody>
                    <tr>
                        { this.renderStocksName() }
                    </tr>
                    <tr>
                        { this.renderStocksSector() }
                    </tr>
                    <tr>
                        { this.renderStocksDescription() }
                    </tr>
                    <tr>
                        { this.renderStocksUrl() }
                    </tr>
                    <tr>
                        { this.renderStocksPhone() }
                    </tr>
                    <tr>
                        { this.renderStocksClose() }
                    </tr>
                    </tbody>
                  </Table>
                  <Table bordered hover>
                    <thead>
                    <tr>
                      <th colSpan={columnSpan}>Statistics</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        { this.renderPreviousClose() }
                    </tr>
                    <tr>
                        { this.renderMonthlyChange() }
                    </tr>
                    <tr>
                        { this.renderMonthlyHigh() }
                    </tr>
                    <tr>
                        { this.renderMonthlyLow() }
                    </tr>
                    <tr>
                        { this.renderYearlyChange() }
                    </tr>
                    <tr>
                        { this.renderYearlyHigh() }
                    </tr>
                    <tr>
                        { this.renderYearlyLow() }
                    </tr>
                    </tbody>
                  </Table>
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
