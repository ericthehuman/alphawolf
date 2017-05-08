import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Data, Companies, Stocks, ModalVar} from '../api/data.js';
import Modal from './Modal.jsx';
import { ReactiveVar } from 'meteor/reactive-var';



export default class Item extends Component {


	handleClick(e){

		console.log("You clicked this item");
		var isOpen = ModalVar.get().isOpen;
		ModalVar.set({
          isOpen: !isOpen,
        }); 
        
	}

	render() {
		return (
			<div className="item" onClick={this.handleClick}>
				<div className="imageHolder">
				
				</div>
				<div className="titleBar">
				{this.props.news}
				</div>

			</div>
		);
	}
}


Item.PropTypes = {

	//put proptypes here

};