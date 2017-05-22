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
		//console.log("test image: " + test);

		return (
			<div className="item" style={{"backgroundImage": test, "backgroundSize": "300px 300px", "backgroundRepeat": "no-repeat", "backgroundPosition": "50% 75%"}} onClick={this.props.optionChange} value={this.props.value} >
				<div style={{"fontSize": "36px","fontWeigth": "bold", "textAlign": "center", color: "#000000"}} >{this.props.news}</div>
			</div>
		);
	}
}


Item.PropTypes = {

	//put proptypes here

};
