import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import Item from './Item.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ReactDOM from 'react-dom';
import { Table, Form } from 'react-bootstrap';

import { Data, Companies, Stocks, SelectedStock, News } from '../../api/data.js';
import Button from './Button.jsx';
import GraphButton from './GraphButton.jsx';
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
  constructor(props) {
    super(props);
    this.state = {
  isOpen: false
};
 
this.openModal = () => {
  console.log("opening moda");
  this.setState({
    isOpen: true
  });
};
 
this.hideModal = () => {
  this.setState({
    isOpen: false
  });
};
  }
  openModal() {
    console.log("opening modal");
  } 
  //converts raw api data into structure the graph component uses
  parseDataIntoGraph(result, news, section){
    if(result != null){

        console.log(result);
        console.log(news);
        console.log(section);
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
        datestr = datestr.split("/");
        var dd = datestr[0];
        var mm = datestr[1];
        var yyyy = datestr[2];
        var timestamp = (new Date(yyyy,mm, dd).getTime());
        var currStockData = [];
        currStockData.push(timestamp);
        dates.push(timestamp);
        currStockData.push(Math.round((array[i].Close)*100));
        stockData.push(currStockData);
      }
      var currNewsItem;
      // parse data for displaying news
      for (var j = 0; j < news.length; j++) {
        currNewsItem = news[j];
        var newsDate = currNewsItem["date"];

        var datestr = newsDate.split("/");
        var dd = datestr[0];
        var mm = datestr[1];
        var yyyy = datestr[2];
        var timestamp = (new Date(yyyy,mm, dd).getTime());

        var newsHeadline = currNewsItem["headline"];
        var currNewsData = {x: timestamp, title: newsHeadline};

        newsData.push(currNewsData);
      }
      console.log("currNews:");
      console.log(currNewsItem);
      i = 0;
  	  while(i < array.length){
  	  	var headline = "";
  	  	var url = "";

  	  	/*for (var j = 0; j < news.length; j++) {
  	  		// add news or industry per date, but limited to one article per day?? -- to avoid same news? fix for now (otherwise should compare article number or something)
  	  		if (news[j] !== undefined && array[i].Date === news[j].date) {
				numMatches++;
  				headline = news[j].headline;
  				url = news[j].url;
                break;
  			} else if (section[j] !== undefined && array[i].Date === section[j].date) {
                numMatches++;
                headline = section[j].headline;
                url = section[j].url;
                break;
            }
        }*/
        values.push(Math.round((array[i].Close)*100));
  	    data.push({
  	      name: array[i].Date,
  	      value: Math.round((array[i].Close)*100),
  		    info: headline,
  		    url: url,
  	     });
  	    i = i +1;
  	  }        console.log("num of article matches " + numMatches);
  	
       var chart = Highcharts.stockChart('container', {
        
        series: [{
          data: stockData,//values,
          name: "Closing Price",
          id: "stockData"
        },{
            type: 'flags',
            name: 'Flags on series',
            data: [{
              x : dates[10],
              title: "<button className='btn btn-primary' onClick={this.openModal}>Open Modal</button>",
            }],//newsData,
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

    var data = this.props.stockData[0];
    var news = this.props.newsData[0];
    console.log(data);
    console.log(news);
    //console.log(this.props.newsData);
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

					<LineChart width={600} height={300} syncId="anyId" data={this.parseDataIntoGraph(data.data, news.data, Session.get('sectionNewsData'))}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       				<XAxis dataKey="name"/>
       				<YAxis domain={['auto', 'auto']}/>
       				<CartesianGrid strokeDasharray="3 3" vertical={false}/>
       				<Tooltip content={ showTooltipData }/>
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
<Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal}>
  <ModalHeader>
    <ModalClose onClick={this.hideModal}/>
    <ModalTitle>Modal title</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <p>Ab ea ipsam iure perferendis! Ad debitis dolore excepturi
      explicabo hic incidunt placeat quasi repellendus soluta,
      vero. Autem delectus est laborum minus modi molestias
      natus provident, quidem rerum sint, voluptas!</p>
  </ModalBody>
  <ModalFooter>
    <button className='btn btn-default' onClick={this.hideModal}>
      Close
    </button>
    <button className='btn btn-primary'>
      Save changes
    </button>
  </ModalFooter>
</Modal>

      <div className='layout-page'>
        <main className='layout-main'>
          <div className='container'>
            <button className='btn btn-primary' onClick={this.openModal}>
              Open Modal
            </button>

            <Modal isOpen={this.state.isOpen} size='modal-lg' onRequestHide={this.hideModal}>
              <ModalHeader>
                <ModalClose onClick={this.hideModal}/>
                <ModalTitle>Modal title</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <button className='btn btn-primary' onClick={this.openSubModal}>
                  Open Sub Modal
                </button>
                <hr/>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Aspernatur assumenda ex iure, necessitatibus odit optio quas
                  recusandae repellat totam. Alias dignissimos ea obcaecati quae
                  qui recusandae rem repellendus, vel veniam!</p>

                <p>Consequatur delectus doloremque in quam qui reiciendis rem
                  ut. Culpa cupiditate doloribus eos est ex illum magni nesciunt
                  obcaecati odit ratione, saepe vitae? Accusantium aliquid
                  assumenda fugiat perferendis ratione suscipit!</p>

                <p>Accusantium ad alias aliquid architecto, aspernatur autem
                  commodi distinctio dolor ducimus excepturi fugit hic laborum
                  maxime, mollitia necessitatibus neque nihil odio, officiis
                  quae quaerat quam quasi quia sed tempore ut!</p>

                <p>Accusamus asperiores aspernatur atque commodi consectetur
                  cumque cupiditate distinctio dolor dolorum eum excepturi
                  expedita explicabo fugiat iusto, labore magnam, natus nesciunt
                  nobis odio officiis provident quam, quasi quo saepe
                  suscipit!</p>

                <p>Accusantium at commodi corporis cum cumque delectus deleniti
                  dicta dolor dolore dolorem ducimus esse fugiat fugit maiores
                  neque nulla perspiciatis placeat, possimus quisquam
                  repellendus saepe suscipit tempore totam, vel voluptatem!</p>

                <p>Consequatur delectus doloremque in quam qui reiciendis rem
                  ut. Culpa cupiditate doloribus eos est ex illum magni nesciunt
                  obcaecati odit ratione, saepe vitae? Accusantium aliquid
                  assumenda fugiat perferendis ratione suscipit!</p>

                <p>Accusantium ad alias aliquid architecto, aspernatur autem
                  commodi distinctio dolor ducimus excepturi fugit hic laborum
                  maxime, mollitia necessitatibus neque nihil odio, officiis
                  quae quaerat quam quasi quia sed tempore ut!</p>

                <p>Accusamus asperiores aspernatur atque commodi consectetur
                  cumque cupiditate distinctio dolor dolorum eum excepturi
                  expedita explicabo fugiat iusto, labore magnam, natus nesciunt
                  nobis odio officiis provident quam, quasi quo saepe
                  suscipit!</p>

                <p>Accusantium at commodi corporis cum cumque delectus deleniti
                  dicta dolor dolore dolorem ducimus esse fugiat fugit maiores
                  neque nulla perspiciatis placeat, possimus quisquam
                  repellendus saepe suscipit tempore totam, vel voluptatem!</p>

                <Modal isOpen={this.state.isSubOpen} onRequestHide={this.hideSubModal} dialogStyles={subModalDialogStyles}>
                  <ModalHeader>
                    <ModalClose onClick={this.hideSubModal}/>
                    <ModalTitle>Sub Modal title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Iusto laborum nemo porro quaerat qui quisquam sequi,
                      tenetur. Alias nostrum qui ratione repellat rerum tenetur
                      voluptas. Commodi dolore eligendi facilis nihil.</p>

                    <p>Autem distinctio fugit laboriosam molestias nulla, qui
                      repudiandae ullam vero voluptas? Aperiam corporis dolore
                      laboriosam molestiae saepe veritatis voluptate,
                      voluptatem. Assumenda ducimus error fugit iusto quos
                      ratione! Doloribus, iste saepe?</p>

                    <p>Ab ea ipsam iure perferendis! Ad debitis dolore excepturi
                      explicabo hic incidunt placeat quasi repellendus soluta,
                      vero. Autem delectus est laborum minus modi molestias
                      natus provident, quidem rerum sint, voluptas!</p>
                  </ModalBody>
                </Modal>
              </ModalBody>
              <ModalFooter>
                <button className='btn btn-default' onClick={this.hideModal}>
                  Close
                </button>
                <button className='btn btn-primary'>
                  Save changes
                </button>
              </ModalFooter>
            </Modal>
          </div>
        </main>
      </div>
				</div>

				);
		}
	}
}

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

}

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
  newsData: PropTypes.array.isRequired,
};
