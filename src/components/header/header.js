import React, { Component } from 'react';

import './header.css';

import NewTaskForm from '../new-task-form';

export default class Header extends Component {
  render() {
    const { addNewItem } = this.props;

    return (
      <header className="header">
        <h1>todos</h1>
        <NewTaskForm addNewItem={addNewItem} />
      </header>
    );
  }
}
