import React from 'react';
import PropTypes from 'prop-types';

import './footer.css';

import TasksFilter from '../tasks-filter';

function Footer({ todos, onAll, onActive, onComplited, onClearComplited }) {
  function getUnfulfilledItemsCount(arr) {
    const resArr = arr.filter((item) => item.done !== true);
    return resArr.length;
  }

  return (
    <footer className="footer">
      <span className="todo-count">{getUnfulfilledItemsCount(todos)} items left</span>
      <TasksFilter onAll={onAll} onActive={onActive} onComplited={onComplited} />
      <button className="clear-completed" onClick={onClearComplited}>
        Clear completed
      </button>
    </footer>
  );
}
Footer.propTypes = {
  onAll: PropTypes.func,
  onComplited: PropTypes.func,
  onClearComplited: PropTypes.func,
};

export default Footer;
