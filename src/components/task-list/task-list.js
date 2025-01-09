import React, { Component } from 'react';

import './task-list.css';

import PropTypes from 'prop-types';

import Task from '../task';

function TaskList({ todos, onTogglePropDone, onTogglePropEdit, onDeleted }) {
  const elems = todos.map((item) => {
    const { id, ...res } = item;

    return (
      <Task
        key={id}
        {...res}
        onTogglePropDone={() => {
          onTogglePropDone(id);
        }}
        onTogglePropEdit={() => {
          onTogglePropEdit(id);
        }}
        onDeleted={() => {
          onDeleted(id);
        }}
      />
    );
  });

  return <ul className="todo-list">{elems}</ul>;
}

TaskList.propTypes = {
  todos: PropTypes.array,
  onTogglePropDone: PropTypes.func,
  onTogglePropEdit: PropTypes.func,
  onDeleted: PropTypes.func,
  id: PropTypes.number,
};

export default TaskList;
