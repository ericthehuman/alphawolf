import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data, Companies, Stocks} from '../../api/data.js';
import Tile from './Tile.jsx';


export default class GraphButton extends Component {
	render() {
		return (
			<div className="radio">
                <input type="radio" id={this.props.numDays} value={this.props.numDays} onChange={this.props.updateGraph}
                             name="choice" className="radio-with-label" />
                <label className="label-for-radio button" htmlFor={this.props.name}>{this.props.name}</label>
            </div>
		);
	}
}


GraphButton.propTypes = {

  numDays: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  updateGraph: PropTypes.func.isRequired,

};
