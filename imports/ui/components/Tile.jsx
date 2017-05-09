import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import Item from './Item.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { Data, Companies, Stocks, SelectedStock } from '../../api/data.js';
import Button from './Button.jsx';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';




export default class Tile extends Component {

//converts raw api data into structure the graph component uses
parseDataIntoGraph(result, news){
  if(result != null){
      console.log(result);
      console.log(news);
	  var array = result.data.CompanyReturns[0].Data;
	  var data = [];
	  var i = 0;
	  while(i < array.length){
	  	var str = "";
	  	for (var j = 0; j < news.length; j++) {
	  		// console.log("comparing articles' dates");
	  		if (array[i].Date === news[j].date) {
	  			console.log("found match!");
				str = (news[j].headline != "") ? news[j].headline : news[j].abstract;
				break;
			}
		}
	    data.push({
	      name: array[i].Date,
	      value: Math.round((array[i].Close)*100),
		  info: str
	    });
	    i = i +1;
	  }
	  return data;
	}
}

	//renders a whole bunch of stats for the user
	render() {
		console.log("Tile rendered");

		if(this.props.display == "HOME"){
		return (
			<div className="tile">
				<Item news={"Uber stocks fall amidst scandals"}/>
				<Item news={"Oil does something"}/>
				<Item news={"Oil does something"}/>
				<Item news={"Oil does something"}/>
				<div className="inner">
					<div className="big">
						{this.props.stockData.code}
					</div>

					<div className="big">

					</div>

				</div>

			</div>
			);
		}else{
			// console.log(this.parseDataIntoGraph(this.props.stockData.data));

			return (
				<div className="tile">
					<div className="inner">
					<div className="big">
					InstrumentID = {this.props.stockData.code} <br />
					Average return = {this.props.stockData.data.data.CompanyReturns[0].Data[100].AV_Return.toFixed(4)} <br />
					Cumulative return = {this.props.stockData.data.data.CompanyReturns[0].Data[100].CM_Return.toFixed(4)}<br />
					100 days ago closing price = {parseFloat(this.props.stockData.data.data.CompanyReturns[0].Data[0].Close).toFixed(2)}<br />
					50 days ago closing price = {parseFloat(this.props.stockData.data.data.CompanyReturns[0].Data[50].Close).toFixed(2)}<br />

					Final closing price = {parseFloat(this.props.stockData.data.data.CompanyReturns[0].Data[100].Close).toFixed(2)}<br />
					</div>

					</div>

					<LineChart width={600} height={300} data={this.parseDataIntoGraph(this.props.stockData.data, Session.get('newsData'))}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       				<XAxis dataKey="name"/>
       				<YAxis domain={['auto', 'auto']}/>
       				<CartesianGrid strokeDasharray="3 3" vertical={false}/>
       				<Tooltip content={ showTooltipData }/>
       				<Legend />
       				<Line type="monotone" dataKey="value" dot={false}  stroke="#8884d8" activeDot={{r: 8}}/>
      				</LineChart>



				</div>

				);
		}
	}
}

function showTooltipData (data) {
    if ( typeof data.payload[0] !== 'undefined') {
    	var date = data.payload[0].payload.name;
    	var value = data.payload[0].payload.value;
    	var info = data.payload[0].payload.info;
		// console.log(this.props.stockData.news);


        // console.log(Object.keys(data.payload[0]));
        // console.log(Object.values(data.payload[0]));
        return <div id="tag">date: {date} price: {value} <br/> {(info !== "") ? "NEWS:" + info : ""}</div>;
    }
}

// const CustomTooltip  = React.createClass({
//     propTypes: {
//         type: PropTypes.string,
//         payload: PropTypes.array,
//         label: PropTypes.string,
//     },
//
//     getIntroOfPage(label) {
//         this.props.stockData.news.forEach ( function (news) {
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
  stockData: PropTypes.object.isRequired,
};
