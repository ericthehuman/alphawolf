import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Nav, NavItem } from 'react-bootstrap';

//this is where the stockbutton do their stuff


class StockButtonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedKey: 'Dashboard' };
    this.setActiveClassOnTab = this.setActiveClassOnTab.bind(this);
    this.handleChangeTabs = this.handleChangeTabs.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  setActiveClassOnTab(tab) {
    return this.state.activeTab === tab ? 'active' : '';
  }

  handleChangeTabs(event) {
    this.setState({ activeTab: event.target.getAttribute('data-tab') });
  }

  handleSelect(eventKey) {
    this.setState({ selectedKey: eventKey });
  }

  render() {
    return (
      <div className="btn-list">
        <Nav bsStyle="pills" activeKey={ this.state.selectedKey } onSelect={ this.handleSelect }>
          <NavItem eventKey="Dashboard">Dashboard</NavItem>
          {this.props.companies.map((company) => {
            return (<NavItem eventKey={company.companyCode}>{ company.companyCode }</NavItem>)
          })}
        </Nav>
      </div>
    )
  }
}

export default StockButtonList
