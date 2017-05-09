import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Form, FormControl, FormGroup, Nav, NavItem  } from 'react-bootstrap';


//stocks input button
class StockInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedKey: 'Dashboard', companies: this.props.companies };
    this.addStock = this.addStock.bind(this);
    this.handleChangeTabs = this.handleChangeTabs.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    }

  addStock() {
    // this.forceUpdate();
    // console.log("REFSA: " + this.refs.inputVal.value);
    var newCompanies = JSON.parse(this.refs.inputVal.value);
    console.log(newCompanies);
    for (var i = 0; i < newCompanies.length; i++) {
      var codeRegex = /\((.*)\)$/;
      var companyCode = codeRegex.exec(newCompanies[i]);
      console.log(companyCode[1]);
      var newCompany = {companyCode: companyCode[1], companyName: newCompanies[i]};
      this.state.companies.push(newCompany);
    }

    this.forceUpdate();
  }

  handleChangeTabs(event) {
    this.setState({ activeTab: event.target.getAttribute('data-tab') });
  }

  handleSelect(eventKey) {
    this.setState({ selectedKey: eventKey });
  }

  render() {
    return (
      <div>
        <Form inline id="stockInputForm">
          <input id="magicsuggest"/>
          {' '}
          <Button bsStyle="success" onClick={ this.addStock } id="addBtn">Add</Button>
          <input type="hidden" ref="inputVal" id="inputVal"/>
        </Form>

        <div className="btn-list">
          <Nav bsStyle="pills" activeKey={ this.state.selectedKey } onSelect={ this.handleSelect }>
            <NavItem eventKey="Dashboard">Dashboard</NavItem>
            {this.state.companies.map((company) => {
              return (<NavItem eventKey={company.companyCode}>{ company.companyCode }</NavItem>)
            })}
          </Nav>
        </div>
      </div>
    )
  }
}

export default StockInput
