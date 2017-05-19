import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies, Stocks} from '../../api/data.js';
import Tile from './Tile.jsx';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';


export default class Button extends Component {
	render() {
		return (
			<div className={this.props.stock.new ? "radio animated slideInRight" : "radio"}>
				<Checkbox id={this.props.stock.code} className="hide-checkbox" value={this.props.stock.name}/>
				<label htmlFor={this.props.stock.code}>{this.props.stock.code}</label>
			</div>
		);
	}
}

/*
	<div className={this.props.stock.new ? "radio animated slideInRight" : "radio"}>

							<input type="checkbox" id={this.props.stock.code} value={this.props.stock.name}
							onChange={this.props.optionChange} name="choice" className="radio-with-label" />
						<label className="label-for-radio button" htmlFor={this.props.stock.code}>
							{this.props.stock.code}
						</label>
				</div>
*/


Button.propTypes = {

  stock: PropTypes.object.isRequired,
  optionChange: PropTypes.func.isRequired,

};
