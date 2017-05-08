import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Form, FormControl, FormGroup } from 'react-bootstrap';


//stocks input button
class StockInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stockInput: 'a' };
    this.addStock = this.addStock.bind(this);
    this.refreshVal = this.refreshVal.bind(this);
  }

  refreshVal() {
    this.setState({ stockInput: this.refs.inputVal.value });
    console.log("Stocks: " + this.state.stockInput);
  }

  addStock() {
    // this.forceUpdate();
    console.log("REFSA: " + this.refs.inputVal.value);
    this.setState({ stockInput: this.refs.inputVal.value });
  }

  render() {
    return (
      <Form inline id="stockInputForm" onChange={ this.refreshVal }>
        <input id="magicsuggest"/>
        {' '}
        <Button bsStyle="success" onClick={ this.addStock } id="addBtn">Add</Button>
        <input type="hidden" ref="inputVal" id="inputVal" onChange={ this.refreshVal }/>
      </Form>
    )
  }
}

export default StockInput
