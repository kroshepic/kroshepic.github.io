import React, { Component } from 'react';

import './new-task-form.css';

export default class NewTaskForm extends Component {
  state = {
    label: '',
    min: '',
    sec: '',
  };

  onInputValueChange = (e, key) => {
    let value = e.target.value;

    if (key === 'sec' && parseInt(value, 10) > 59) {
      value = 59;
    }

    this.setState({
      [key]: value,
    });
  };

  onLabelChange = (e) => {
    this.onInputValueChange(e, 'label');
  };

  onMinValueChange = (e) => {
    this.onInputValueChange(e, 'min');
  };

  onSecValueChange = (e) => {
    this.onInputValueChange(e, 'sec');
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.label.length === 0) {
      alert('Заполните описание задачи...');
      return;
    }

    const min = parseInt(this.state.min, 10) || 0;
    const sec = parseInt(this.state.sec, 10) || 0;
    const timer = min * 60 + sec;

    // Создаём задачу с таймером
    this.props.addNewItem(this.state.label, timer);

    this.setState({
      label: '',
      min: '',
      sec: '',
    });
  };

  handleKeyPress = (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      this.onSubmit(e);
    }
  };

  render() {
    return (
      <>
        <form className="new-todo-form" onSubmit={this.onSubmit} onKeyUp={this.handleKeyPress}>
          <input
            className="new-todo"
            placeholder="Task..."
            autoFocus
            onChange={this.onLabelChange}
            value={this.state.label}
          />
          <input
            className="new-todo-form__timer"
            placeholder="Min"
            autoFocus
            type={'number'}
            onChange={this.onMinValueChange}
            value={this.state.min}
          />
          <input
            className="new-todo-form__timer"
            placeholder="Sec"
            autoFocus
            type={'number'}
            onChange={this.onSecValueChange}
            value={this.state.sec}
          />
        </form>
      </>
    );
  }
}
