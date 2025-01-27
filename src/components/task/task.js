import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './task.css';

export default class Task extends Component {
  state = {
    label: this.props.description,
  };

  static defaultProps = {
    timeAgo: '0 seconds',
    done: false,
    editing: false,
    hidden: false,
  };

  static propTypes = {
    description: PropTypes.string,
    done: PropTypes.bool,
    editing: PropTypes.bool,
    hidden: PropTypes.bool,
    onTogglePropDone: PropTypes.func,
    onTogglePropEdit: PropTypes.func,
    onDeleted: PropTypes.func,
    timeAgo: (props, propName, componentName) => {
      if (typeof props[propName] === 'string') return null;
      return TypeError(`${componentName}: ${propName} must be string`);
    },
  };

  handleChange = (event) => {
    this.setState({
      label: event.target.value,
    });
  };

  render() {
    const {
      description,
      done,
      editing,
      hidden,
      onTogglePropDone,
      onTogglePropEdit,
      onDeleted,
      timeAgo,
      changeItemLabel,
      timer,
      startTimer,
      pauseTimer,
    } = this.props;

    let className = '';

    if (done) className += 'completed';
    if (editing) className += 'editing';
    if (hidden) className += ' hidden';

    return (
      <li className={className}>
        <div className="view">
          <input className="toggle" type="checkbox" onClick={onTogglePropDone} />
          <label>
            <span className="title">{description}</span>
            <span className="description">
              <button className="icon icon-play" onClick={startTimer}></button>
              <button className="icon icon-pause" onClick={pauseTimer}></button>
              {timer}
            </span>
            <span className="description">created {timeAgo} ago</span>
          </label>
          <button className="icon icon-edit" onClick={onTogglePropEdit}></button>
          <button className="icon icon-destroy" onClick={onDeleted}></button>
        </div>
        {className === 'editing' && (
          <form onSubmit={changeItemLabel} className="editing-form">
            <input type="text" className="edit" value={this.state.label} onChange={this.handleChange} />
          </form>
        )}
      </li>
    );
  }
}
