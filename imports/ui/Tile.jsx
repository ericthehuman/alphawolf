import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import Item from './Item.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';

import { Data, Companies, Stocks, SelectedStock } from '../api/data.js';
import Button from './Button.jsx';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';




export default class Tile extends Component {


//converts raw api data into structure the graph component uses
parseDataIntoGraph(result){
  if(result != null){
	  var array = result.data.CompanyReturns[0].Data;
	  console.log(array);
	  var data = [];
	  var i = 0;
	  while(i < array.length){
	    data.push({
	      name: i,
	      value: Math.round((array[i].Close)*100)
	    });
	    i = i +1;
	  }

	  console.log(data);
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
			console.log(this.parseDataIntoGraph(this.props.stockData.data));

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

					 <LineChart width={600} height={300} data={this.parseDataIntoGraph(this.props.stockData.data)}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       				<XAxis dataKey="name"/>
       				<YAxis domain={['dataMin', 'dataMax']}/>
       				<CartesianGrid strokeDasharray="3 3"/>
       				<Tooltip/>
       				<Legend />
       				<Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{r: 8}}/>
      				</LineChart>



				</div>

				);
		}
	}
}


Tile.propTypes = {
  // This component gets the return figure to display through a React prop.
  // We can use propTypes to indicate it is required
  stockData: PropTypes.object.isRequired,
};
