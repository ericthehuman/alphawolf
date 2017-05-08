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
        this.testString = "test";
    }

    renderData() {

        //the first thing
        console.log(this.props.ddata[0]);
        if(this.props.ddata[0] != undefined){
            return this.props.ddata[0].content;
        }
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
            } else{
                //a heap of console.logs to debug
                //console.log(result.content);
                var obj = JSON.parse(result.content);
                var cum_return = obj.CompanyReturns[0].Data[7].CM_Return;
                var ave_return = obj.CompanyReturns[0].Data[7].AV_Return;
                var ave_ret_rounded = cum_return.toFixed(4);
                //console.log(cum_return.toFixed(4));
                //console.log(ave_ret_rounded);
                test = "hello";
                Data.update(0, {$set: {content: JSON.stringify(ave_ret_rounded)}});
            }
        });

        // select company code of the selected radio button
        var companyID = this.state.selected;
        console.log("Returning articles on "+companyID);
        Meteor.http.call('GET',
            'https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=591e19bb7d974693b30e645f3288102d&q='+companyID,
            function (error,result) {
            if (error) {
                console.log(error);
            } else {
                console.log(result.content);

                var content = EJSON.parse(result.content);
                //var doc = EJSON.parse(content["response"]);
                //for (doc in content["response"]) {
                    console.log((content["response"])["docs"]);
                var docs = (content["response"])["docs"];
                console.log(docs);

                for (const key of Object.keys(docs)) {
                    console.log(docs[key]);
                    // want to print abstract
                    console.log((docs[key])["snippet"]);
                }
                //}
                this.testString = "hello world";
                console.log(content);
                /*for(doc in content){
                    console.log('inserting', doc);
                    //Cities.insert({country: country, cities: content[country]});
                }*/
            }
        });
    }
//we can populate the radio button selection with a function later

    render() {
        var graphData = [
            {name: 'Page A', cm: 4000, am: 2400},
            {name: 'Page B', cm: 3000, am: 1398},
            {name: 'Page C', cm: 2000, am: 9800},
            {name: 'Page D', cm: 2780, am: 3908},
            {name: 'Page E', cm: 1890, am: 4800},
            {name: 'Page F', cm: 2390, am: 3800},
            {name: 'Page G', cm: 3490, am: 4300},
        ];
        return (
            <div className="container">
                <header>
                    <h1>cubs of wall street</h1>
                </header>
                <AccountsUIWrapper />
                <div className="info font">
                    Choose a company from the list below to look at relevant statistics </div> <form> <div className="radio"> <input type="radio" id="AAPL" value="AAPL" onChange={this.handleOptionChange} name="choice" className="radio-with-label" /> <label className="label-for-radio button" htmlFor="AAPL"> &nbsp; apple  &nbsp;</label> </div> <div className="radio"> <input type="radio" id="MSFT" value="MSFT" onChange={this.handleOptionChange} name="choice" className="radio-with-label" /> <label className="label-for-radio button" htmlFor="MSFT"> &nbsp; microsoft  &nbsp;</label> </div>
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
                    <Tooltip content={<CustomTooltip />}/>
                    <Legend />
                    <Line type="monotone" dataKey="am" stroke="#8884d8" activeDot={{r: 8}}/>
                    <Line type="monotone" dataKey="cm" stroke="#82ca9d" />
                </LineChart>


            </div>
        );
    }
}

const CustomTooltip  = React.createClass({
  propTypes: {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string,
  },

  getIntroOfPage(label) {
    if (label === 'Page A') {
        return "Edward Boryne of 138 West Forty-second Street and Miss Cornelia S. Penfield of 417 West 123d Street were struck and thrown twenty feet by an automobile as they were crossing Broadway at 120th Street at 10 o'clock last night....";
    } else if (label === 'Page B') {
      return "Stocks that moved substantially or traded heavily Friday on the New York Stock Exchange and the Nasdaq stock market:...";
    } else if (label === 'Page C') {
      return "No longer called Research in Motion, the BlackBerry maker will now go simply by BlackBerry. Some past corporate name changes have worked out, while others have not...";
    } else if (label === 'Page D') {
      return "Richard Branson’s announcement that he’ll offer employees unlimited time off has some wondering if the policy really helps workers....";
    } else if (label === 'Page E') {
      return "Edward Boryne of 138 West Forty-second Street and Miss Cornelia S. Penfield of 417 West 123d Street were struck and thrown twenty feet by an automobile as they were crossing Broadway at 120th Street at 10 o'clock last night....";
    } else if (label === 'Page F') {
      return "Deutsche Bank posts a $3 billion loss in the fourth quarter. | Facebook's earnings give investors reasons for optimism and some cause for concern. | A government lawyer who secured a conviction of Raj Rajaratnam is headed to a private firm. | Rese...";
    } else if (label == 'Page G') {
        return "Yields on six-month Treasury bills rose slightly yesterday, reaching their highest levels since December 1974. Three-month bill rates were the highest since January....";
    }
  },

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{this.getIntroOfPage(label)}</p>
        </div>
      );
    }

    return null;
  }
});

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
