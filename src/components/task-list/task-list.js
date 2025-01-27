import React from 'react';
import PropTypes from 'prop-types';

import Task from '../task';
import './task-list.css';

function TaskList({ todos, onTogglePropDone, onTogglePropEdit, onDeleted, changeItemLabel, startTimer, pauseTimer }) {
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
        changeItemLabel={changeItemLabel}
        startTimer={() => {
          startTimer(id);
        }}
        pauseTimer={() => {
          pauseTimer(id);
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
