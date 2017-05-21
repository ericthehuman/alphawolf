import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Data, Companies, Stocks, ModalVar} from '../../api/data.js';
import Modal from './Modal.jsx';
import { ReactiveVar } from 'meteor/reactive-var';


//some styles, too lazy to figure how to import style sheets

var fancy = {
	 "border": "2px solid black"

}
export default class Item extends Component {


	/*div.transbox p {
	  text-align: center;
	  font-weight: bold;
	  color: #ffffff ;
	}*/

	handleClick(e){

		console.log("You clicked on " + this.props.value);
		var isOpen = ModalVar.get().isOpen;
		ModalVar.set({
          isOpen: !isOpen,
        });
	}

	render() {
		return (
			<div className="item" onClick={this.handleClick} value={this.props.value} >
				<h2 style={{fancy.textstyle}} >{this.props.news}</h2>
			</div>
		);
	}
}


Item.PropTypes = {

	//put proptypes here

};
