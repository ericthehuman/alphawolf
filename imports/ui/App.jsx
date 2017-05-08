import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies } from '../api/data.js';
import Tile from './Tile.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 
// App component - represents the whole app
class App extends Component {

constructor(props){
  super(props);
  this.handleOptionChange = this.handleOptionChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.state = {
    selected: "",
    submitted: false,
  };
}

renderData() {

  //the first thing
  console.log(this.props.ddata[0]);
  if(this.props.ddata[0] != undefined){
    return this.props.ddata[0].content;
  }
//    return this.props.ddata.map((n) =>(
//    'content:' + n.content
  //  ));
}

handleOptionChange(changeEvent) {
  this.setState({
    selected: changeEvent.currentTarget.value
  });
}



handleSubmit(event){
  event.preventDefault();
  this.setState({
    submitted: true,
  });
  var test = "world";
  Meteor.call('getData', this.state.selected, function(error, result){
    if(error){
      console.log(error);
    }else{
      //a heap of console.logs to debug 
      console.log(result.content);
      var obj = JSON.parse(result.content);
      var cum_return = obj.CompanyReturns[0].Data[7].CM_Return;
      var ave_return = obj.CompanyReturns[0].Data[7].AV_Return;
      var ave_ret_rounded = cum_return.toFixed(4);
      console.log(cum_return.toFixed(4));
      console.log(ave_ret_rounded);
      test = "hello";
      Data.update(0, {$set: {content: JSON.stringify(ave_ret_rounded)}});
    }
  })
}
//we can populate the radio button selection with a function later
//this is the part where it graphs stats on the home page
  render() {
    var graphData = [
      {name: '10 Jan', cm: 4000, am: 2400, amt: 2400},
      {name: '11 Jan', cm: 3000, am: 1398, amt: 2210},
      {name: '12 Jan', cm: 2000, am: 9800, amt: 2290},
      {name: '13 Jan', cm: 2780, am: 3908, amt: 2000},
      {name: '14 Jan', cm: 1890, am: 4800, amt: 2181},
      {name: '15 Jan', cm: 2390, am: 3800, amt: 2500},
      {name: '16 Jan', cm: 3490, am: 4300, amt: 2100},
];
    return (
      <div className="container">
        <header>
          <h2> something ugly af </h2>
          <h1>cubs of wall street</h1>
        </header>
        <AccountsUIWrapper />
        <div className="info font">
          Choose a company from the list below to look at relevant statistics
        </div> 
        <form>
            <div className="radio">
                <input type="radio" id="AAPL" value="AAPL" onChange={this.handleOptionChange}
                             name="choice" className="radio-with-label" />
                <label className="label-for-radio button" htmlFor="AAPL">
                    <img src="https://cdn1.iconfinder.com/data/icons/simple-icons/4096/apple-4096-black.png" className="radio-image" />
                    &nbsp; Apple (AAPL)  &nbsp;</label>
            </div>

            <div className="radio">
                <input type="radio" id="MSFT" value="MSFT" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label" />
                <label className="label-for-radio button" htmlFor="MSFT">
                <img src="http://www.freeiconspng.com/uploads/microsoft-new-logo-simple-0.png" className="radio-image"/>
                    &nbsp; Microsoft (MSFT)  &nbsp;
                </label>
            </div>

            <div className="radio">
                <input type="radio" id="BBRY" value="BBRY" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label"  />
                <label className="label-for-radio button" htmlFor="BBRY">
                    <img src="http://simpleicon.com/wp-content/uploads/blackberry.svg" className="radio-image" />
                    &nbsp; Blackberry (BBRY)  &nbsp;
                </label>
            </div>
        </form>


        <form onSubmit={this.handleSubmit.bind(this)}>
        <input id="submit" type="submit"/>
        <label className="label-for-submit" htmlFor="submit">Go</label>
        </form>
         <Tile someData={this.renderData()}/>
      <LineChart width={600} height={300} data={graphData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="am" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="cm" stroke="#82ca9d" />
      </LineChart>
      </div>

    
    );
  }
}

App.propTypes = {
  ddata: PropTypes.array.isRequired,
  comps: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    ddata: Data.find({}).fetch(),
    comps: Companies.find({}).fetch()
  };
}, App);
