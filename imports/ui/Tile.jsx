import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { createContainer } from 'meteor/react-meteor-data';
import { Data } from '../api/data.js';
import { Companies} from '../api/data.js';


export default class Tile extends Component {
	render() {
		return (
			<div> 
				<div>
				AVERAGE RETURN
					<div>
						{this.props.someData} 
					</div>	
				CUMULATIVE RETURN
					<div>
					</div>
				</div>
			</div>
			);
	}
}


Tile.propTypes = {
  // This component gets the return figure to display through a React prop.
  // We can use propTypes to indicate it is required
  someData: PropTypes.string,
};