import React from 'react';

import './tasks-filter.scss';

function TasksFilter({ onAll, onActive, onComplited }) {
  return (
    <ul className="filters">
      <li>
        <button className="selected" onClick={onAll}>
          All
        </button>
      </li>
      <li>
        <button onClick={onActive}>Active</button>
      </li>
      <li>
        <button onClick={onComplited}>Completed</button>
      </li>
    </ul>
  );
}

export default TasksFilter;
