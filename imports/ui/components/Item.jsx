import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Data, Companies, Stocks, ModalVar} from '../../api/data.js';
import Modal from './Modal.jsx';
import { ReactiveVar } from 'meteor/reactive-var';


//some styles, too lazy to figure how to import style sheets

export default class Item extends Component {

	render() {
		var test = "url(" + this.props.imagef + ")";
		//console.log("test image: " + test);

		return (
			<button type="button" className="item" onClick={this.props.optionChange} value={this.props.value}>
			<span className="item-text">{this.props.news}</span>
			<img src={this.props.imagef} className="item-img"/>
			</button>
			//*<span style={{"display": "block", "position": "absolute", "top": "0", "left": "0"}}>*/
			// 	<div style={{"fontSize": "36px","fontWeigth": "bold", "textAlign": "center", color: "#000000"}} >{this.props.news}</div>
			// </div>
		);
	}
}


Item.PropTypes = {

	//put proptypes here

	stockVal: PropTypes.object.isRequired

};
