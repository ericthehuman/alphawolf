import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Nav, NavItem } from 'react-bootstrap';

class StockButtonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'Dashboard', selectedKey: 'Test' };
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
          <NavItem eventKey="Test">Test Item</NavItem>
          <NavItem eventKey="{ this.props.companyCode }">{ this.props.companyCode }</NavItem>
        </Nav>
        <div className={`tabs-data-container ${ this.setActiveClassOnTab( `'{ this.props.companyCode }'` )}`}>
          { this.props.companyName }
        </div>
      </div>
    )
  }
}

export default StockButtonList
