import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Data, Companies, Stocks, ModalVar} from '../../api/data.js';
import Modal from './Modal.jsx';
import { ReactiveVar } from 'meteor/reactive-var';


//some styles, too lazy to figure how to import style sheets

export default class Item extends Component {

	handleClick(e){
		var isOpen = ModalVar.get().isOpen;
		ModalVar.set({
          isOpen: !isOpen,
        });
	}
	render() {
		var test = "url(" + this.props.imagef + ")";
		// console.log("test image: " + test);
		return (
			<div className="item" style={{"background-image": test}} onClick={this.handleClick} value={this.props.value} >
				<h2 style={{"font-weigth": "bold", "text-align": "center", color: "#ffffff"}} >{this.props.news}</h2>
			</div>
		);
	}
}


Item.PropTypes = {

	//put proptypes here

};
