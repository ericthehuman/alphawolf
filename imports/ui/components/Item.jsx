import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Data, Companies, Stocks, ModalVar} from '../../api/data.js';
import Modal from './Modal.jsx';
import { ReactiveVar } from 'meteor/reactive-var';
import styles from '../style/tiles.css';



export default class Item extends Component {


	/*div.transbox p {
	  text-align: center;
	  font-weight: bold;
	  color: #ffffff ;
	}*/

	handleClick(e){

		console.log("You clicked this item");
		var isOpen = ModalVar.get().isOpen;
		ModalVar.set({
          isOpen: !isOpen,
        });

	}

	render() {
		return (
			<div background={this.props.imagef} className="item" onClick={this.handleClick} value={this.props.value}>
				<div className={styles.transbox}>{this.props.news}</div>
			</div>
		);
	}
}


Item.PropTypes = {

	//put proptypes here

};
