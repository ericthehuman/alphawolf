import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Form, FormControl, FormGroup } from 'react-bootstrap';


//stocks input button
class StockInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form inline>
        <div id="magicsuggest"></div>
        {' '}
        <Button bsStyle="success">Add</Button>
      </Form>
    )
  }
}

export default StockInput
