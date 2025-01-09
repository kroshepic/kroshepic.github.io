import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './task.css';

export default class Task extends Component {
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
      /* Для реализации без PropTypes */
      if (typeof props[propName] === 'string') return null;
      return TypeError(`${componentName}: ${propName} must be string`);
    },
  };

  render() {
    const { description, done, editing, hidden, onTogglePropDone, onTogglePropEdit, onDeleted, timeAgo } = this.props;

    let className = '';

    if (done) className += 'completed';
    if (editing) className += 'editing';
    if (hidden) className += ' hidden';

    return (
      <li className={className}>
        <div className="view">
          <input className="toggle" type="checkbox" onClick={onTogglePropDone} />
          <label>
            <span className="description">{description}</span>
            <span className="created">created {timeAgo} ago</span>
          </label>
          <button className="icon icon-edit" onClick={onTogglePropEdit}></button>
          <button className="icon icon-destroy" onClick={onDeleted}></button>
        </div>
        {className === 'editing' && <input type="text" className="edit" value={description} />}
      </li>
    );
  }
}
