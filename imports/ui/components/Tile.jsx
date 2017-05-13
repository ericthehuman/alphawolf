import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import Item from './Item.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { Table, Form } from 'react-bootstrap';

import { Data, Companies, Stocks, SelectedStock } from '../../api/data.js';
import Button from './Button.jsx';
import GraphButton from './GraphButton.jsx';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

var Highcharts = require('highcharts/highstock');




export default class Tile extends Component {

  //converts raw api data into structure the graph component uses
  parseDataIntoGraph(result){

    if(result != null){

    console.log(result);

      var array = result;
      // this is data for original graph
      var data = [];

      // data for new graph
      var dates = [];
      var values = [];

  	  for (var i = 0; i < result.length; i++) {
        dates.push(result[i].Date); // x axis
        values.push(Math.round((result[i].Close))); // y axis (in whole dollars)

  	    data.push({
  	      name: result[i].Date,
  	      value: Math.round((result[i].Close)*100),
  	    });
  	  }

        var newsDataArray = [];
        var newsData = Session.get('newsData');
        // console.log("UPDATED NEWSDATA");

        for (var k = 0; k < newsData.length; k++) { //newsData.length
            var y = 0;
            for (var n = 0; n < dates.length; n++) {
                if (dates[n] === newsData[k].date) {
                    y = n;
                    console.log("match index " + n);
                    break;
                }
            };
            newsDataArray.push({
                x: Date.UTC(newsData[k].date.substring(6.10), newsData[k].date.substring(3,5), newsData[k].date.substring(0,2)),
                y: values[y],
                text: newsData[k].headline,
                title: "News",
                shape: 'squarepin'
            })
        }

        // data for new graph
      var options = {
        title: {
          text: "Closing Price"
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: { // yaxis doesn't seem to work..
          text: "Price",
          enabled: true,
          allowDecimals: true
        },
        series: [ // series of data to show
          // first data set, share prices
          {
            data: values,
            pointStart: Date.UTC(dates[0].substring(6.10), dates[0].substring(3,5), dates[0].substring(0,2)), // change format to Dates; this is start date to match value data
            pointInterval: 24 * 3600 * 1000, // one day
            name: "Closing Price"
          },
          { // second data set, news flags
            type: 'flags',
            name: "Company News",
            color: '#333333',
            shape: 'squarepin',
            data: newsDataArray, // actual data for news flags
            showInLegend: true
          },
          // insert more data sets if you wish
        ],
        // ... more options - see http://api.highcharts.com/highcharts
      };

      var chart = Highcharts.chart('container', options); // draw new graph

      return data; // return data to draw original graph
  	}
  }

	// parseAVDataIntoGraph(result){
	// 	if(result != null){
	// 		var array = result;
	// 		console.log(array);
	// 		var data = [];
	// 		var i = 0;
	// 		while(i < array.length){
	// 			data.push({
	// 				name: array[i].Date,
	// 				value: Math.round((array[i].AV_Return)*100)
	// 			});
	// 			i = i +1;
	// 		}
  //
	// 		console.log(data);
	// 		return data;
	// 	}
	// }
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

	// parseCMDataIntoGraph(result){
	// 	if(result != null){
	// 		var array = result;
	// 		// console.log(array);
	// 		var data = [];
	// 		var i = 0;
	// 		while(i < array.length){
	// 			data.push({
	// 				name: array[i].Date,
	// 				value: Math.round((array[i].CM_Return)*100)
	// 			});
	// 			i = i +1;
	// 		}
  //
	// 		// console.log(data);
	// 		return data;
	// 	}
	// }


  handleUpdateGraph(eventChange) {
    console.log("Num days for graph will be: " + eventChange.currentTarget.value);
  }

	//renders a whole bunch of stats for the user
	render() {
		// console.log("Tile rendered");

    // While we only have functionality for 1 stock

    var data = this.props.stockData[0];
    console.log(data);
    console.log("NAME: " + data.name);
    console.log("CODE: " + data.code);

		if(data.code === "Home"){
		return (
			<div className="tile">
				<Item news={"Uber stocks fall amidst scandals"} imagef={"uber.jpg"}/>
				<Item news={"Apple releases new software"} imagef={"apple.png"}/>
				<Item news={"ThinkPad designs sleek computer"} imagef={"thinkpad.jpg"}/>
				<Item news={"UNSW records record numbers"} imagef={"unsw.jpg"}/>
			</div>
			);
		}else{
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

          <Form>
            <GraphButton name={"Last Year"} numDays={365} updateGraph={this.handleUpdateGraph.bind(this)}/>
            <GraphButton name={"Last Month"} numDays={30} updateGraph={this.handleUpdateGraph.bind(this)}/>
            <GraphButton name={"Last Week"} numDays={7} updateGraph={this.handleUpdateGraph.bind(this)}/>
            <GraphButton name={"Today"} numDays={1} updateGraph={this.handleUpdateGraph.bind(this)}/>
          </Form>
					<h2>Closing Price</h2>

					<LineChart width={600} height={300} syncId="anyId" data={this.parseDataIntoGraph(data.data)}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       				<XAxis dataKey="name"/>
       				<YAxis domain={['auto', 'auto']}/>
       				<CartesianGrid strokeDasharray="3 3" vertical={false}/>
       				<Tooltip />
       				<Line type="monotone" dataKey="value" dot={false}  stroke="#8884d8" activeDot={{r: 8}}/>
      				</LineChart>


              <div id="container"></div>
					{/*<h2>Cumulative Return</h2>
					<LineChart width={600} height={300} syncId="anyId" data={this.parseCMDataIntoGraph(data.data)}
							   margin={{top: 5, right: 30, left: 20, bottom: 5}}>
						<XAxis dataKey="name"/>
						<YAxis domain={['auto', 'auto']}/>
						<CartesianGrid strokeDasharray="3 3" vertical={false}/>
						<Tooltip content={ showTooltipData }/>
						<Line type="monotone" dataKey="value" dot={false}  stroke="#8884d8" activeDot={{r: 8}}/>
					</LineChart>*/}

					{/*trying to test a button to trigger an insertion into graph... -> connected to event trigger in routes.js but doens't work*/}
				<div id="testButton"><button class="btn btn-primary">News</button></div>
					</div>

				);
		}
	}
}


/* right now redundant
function showTooltipData (data) {
    if ( typeof data.payload[0] !== 'undefined') {
        // console.log(data.news);
        // console.log(Object.keys(data.payload[0]));
        // console.log(Object.values(data.payload[0]));
    	var date = data.payload[0].payload.name;
    	var value = data.payload[0].payload.value;
    	var info = data.payload[0].payload.info;
    	var url = data.payload[0].payload.url;

      if (typeof(info) != 'undefined') {
        // return tooltip as url link if there exists an article, or just return share data
    		return <div id="tag">{date}<br/>
    							 Price: ${value/100}<br/>
    			                 <a href={(url !== "") ? url : ""} target="_blank">
    							 {(info !== "") ? "NEWS:" + info : ""}</a></div>;
      } else {
          return <div id="tag">{date}<br/>
      							 Cumulative Return: {value}%<br/></div>;
      }
    }

}*/

// style={{marginRight: spacing + 'em'}} ,  style="height: 500px; min-width: 310px; max-width: 600px; margin: 0 auto"
//const CustomTooltip  = React.createClass({
//     propTypes: {
//         type: PropTypes.string,
//         payload: PropTypes.array,
//         label: PropTypes.string,
//     },
//
//     getIntroOfPage(label) {
//         data.news.forEach ( function (news) {
// 			if (news.date === label) {
// 				return news.headline;
// 			}
// 		})
//     },
//
//     render() {
//         const { active } = this.props;
//
//         if (active) {
//             const { payload, label } = this.props;
//             return (
// 				<div className="custom-tooltip">
// 					<p className="label">{`${label} : ${payload[0].value}`}</p>
// 					<p className="intro">{this.getIntroOfPage(label)}</p>
// 					<p className="desc">Anything you want can be displayed here.</p>
// 				</div>
//             );
//         }
//
//         return null;
//     }
// });


Tile.propTypes = {
  // This component gets the return figure to display through a React prop.
  // We can use propTypes to indicate it is required
  stockData: PropTypes.array.isRequired,
};
