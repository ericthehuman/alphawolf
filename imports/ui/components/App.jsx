import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies, Stocks, SelectedStock } from '../../api/data.js';
import Tile from './Tile.jsx';
import Button from './Button.jsx';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { ReactiveVar } from 'meteor/reactive-var';
import { Button as BSButton, Form, FormControl, FormGroup, Nav, NavItem  } from 'react-bootstrap';





// App component - represents the whole app
class App extends Component {

constructor(props){
  super(props);
  this.handleOptionChange = this.handleOptionChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.addStock = this.addStock.bind(this);
  this.state = {
    selected: "",
    submitted: false,
  };

}

parseDataIntoGraph(result){
  var array = result.content.data.CompanyReturns.Data;
  var data = [];
  var i = 0;
  while(i < array.length()){
    data.push({
      name: i-100,
      value: array[i].Closing
    });
    i = i +1;
  }

  return data;

}

renderTile() {

//if there are two selected things
//if there is one selected thing max
//if
  console.log("Code to pass: " + this.props.selectedStock.code);
  console.log("Name to pass: " + this.props.selectedStock.name);
  if(this.props.selectedStock.code == "HOME"){
    return (
      <div>
        <Tile stockData={this.props.selectedStock} display={"HOME"} />
      </div>
    );
  }else{
    return (
      <div>
        <Tile stockData={this.props.selectedStock} />
      </div>
    );
  }

}

handleOptionChange(eventChange) {

  //this is necessary to display changes in UI state
  var stockName = eventChange.currentTarget.value;
  var stockCode = eventChange.currentTarget.id;
  console.log("Stock name: " + stockName);

  this.setState({
    selected: stockCode
  });

  console.log("option Changed to " + stockCode);



  if(stockCode != "HOME"){
    console.log("Stock selected for viewing");
    Meteor.call('getData', stockCode, function(error, result) {
      if(result){
        //get what i want from result
        // console.log(result);
        console.log("NAMe is still: " + stockName);
        SelectedStock.set({
          name: stockName,
          code: stockCode,
          data: result
        });
      }
    });

  }else{
    console.log("HOME");
    SelectedStock.set({
      code: "HOME",
      data: ""
    })
  }

}

/*
renderStocks(){
  return this.props.stocks.map((stock) => (

            <div className="radio">

                <input type="radio" key ={stock._id} id={stock.code} value={stock.code} onChange={this.handleOptionChange}
                             name="choice" className="radio-with-label" />
                <label className="label-for-radio button" htmlFor={stock.code}> &nbsp; {stock.name}  &nbsp;</label>
            </div>
    ));
}

*/

renderStocks() {
  return this.props.stocks.map((stock) => (
    <Button key={stock._id} stock={stock} optionChange={this.handleOptionChange.bind(this)} />
    ));
}

// Old submit
handleSubmit(event){
  event.preventDefault();
  const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
  Stocks.insert({
    name: text,
    code: text
  });
  console.log("Stock added");

  ReactDOM.findDOMNode(this.refs.textInput).value='';

}

// New submit
addStock() {
  var newCompanies = JSON.parse(this.refs.inputVal.value);
  console.log(newCompanies);
  for (var i = 0; i < newCompanies.length; i++) {
    var codeRegex = /\((.*)\)$/;
    var companyName = newCompanies[i];
    var companyCode = codeRegex.exec(companyName);
    companyName.replace(/ \(.*\)$/, "");
    console.log(companyName);
    Stocks.insert({
      name: companyName,
      code: companyCode[1]
    });
    console.log("Stock added");
  }

  this.forceUpdate();
}

//we can populate the radio button selection with a function later

  render() {
    console.log("App rendered");
    console.log(SelectedStock.get().code)
    return (
      <div className="container">
        <header>
          <h1>cubs of wall street</h1>
        </header>
{/*
        <div className="info font">
          Choose a company from the list below to look at relevant statistics
        </div>
*/}

        <Form inline id="stockInputForm">
          <input id="magicsuggest"/>
          {' '}
          <BSButton bsStyle="success" onClick={ this.addStock } id="addBtn">Add</BSButton>
          <input type="hidden" ref="inputVal" id="inputVal"/>
        </Form>
{/*
        <form>
          <input type="text" ref="textInput" className="searchBar" placeholder="Search for a company or keyword"/>
        </form>


        <form onSubmit={this.handleSubmit.bind(this)}>
          <input id="submit" type="submit"/>
          <label className="label-for-submit" htmlFor="submit">Add stock</label>
        </form>
*/}

        <form>

          {this.renderStocks()}

        </form>
         {this.renderTile()}

{/*

            <div className="radio">

                <input type="radio" id="AAPL" value="AAPL" onChange={this.handleOptionChange}
                             name="choice" className="radio-with-label" />
                <label className="label-for-radio button" htmlFor="AAPL"> &nbsp; xxx  &nbsp;</label>
            </div>

            <div className="radio">



                <input type="radio" id="MSFT" value="MSFT" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label" />
                             <label className="label-for-radio button" htmlFor="MSFT"> &nbsp; yyy  &nbsp;</label>
            </div>
            <div className="radio">
                <input type="radio" id="BBRY" value="BBRY" onChange={this.handleOptionChange}
                              name="choice" className="radio-with-label"  />
                             <label className="label-for-radio button" htmlFor="BBRY"> &nbsp; zzz  &nbsp;</label>

            </div>
          </form>


*/}



{/*

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
*/}

      </div>







    );
  }
}

App.propTypes = {
  ddata: PropTypes.array.isRequired,
  comps: PropTypes.array.isRequired,
  stocks: PropTypes.array.isRequired,
  selectedStock: PropTypes.object,
};

export default createContainer(() => {
  return {
    ddata: Data.find({}).fetch(),
    comps: Companies.find({}).fetch(),
    stocks: Stocks.find({}).fetch(),
    selectedStock: SelectedStock.get()
  };
}, App);
