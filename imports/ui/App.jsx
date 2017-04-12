import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies } from '../api/data.js';
import Tile from './Tile.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


 
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

      Data.update(1, {$set: {content: JSON.stringify(ave_ret_rounded)}});
    }
  })

}
//we can populate the radio button selection with a function later

  render() {
    var graphData = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];
    return (
      <div className="container">
        <header>
          <h1>cubs of wall street</h1>
        </header>
        <div className="info font">
          Choose a company from the list below to look at relevant statistics
        </div> 
        <form>
            <div className="radio">
             
                <input type="radio" id="AAPL" value="AAPL" onChange={this.handleOptionChange}
                             name="choice" className="radio-with-label" />
                <label className="label-for-radio button" htmlFor="AAPL"> &nbsp; apple  &nbsp;</label>
            </div>
            <div className="radio">



                <input type="radio" id="MSFT" value="MSFT" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label" />
                             <label className="label-for-radio button" htmlFor="MSFT"> &nbsp; microsoft  &nbsp;</label>
            </div>
            <div className="radio">
                <input type="radio" id="BBRY" value="BBRY" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label"  />
                             <label className="label-for-radio button" htmlFor="BBRY"> &nbsp; blackberry  &nbsp;</label>

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
       <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
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

