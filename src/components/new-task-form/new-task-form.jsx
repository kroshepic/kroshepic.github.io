import React, { useReducer } from 'react';
import './new-task-form.scss';

const initialState = {
  label: '',
  min: '',
  sec: '',
}

function formReducer(state, action) {
  switch (action.type) {
    case 'label':
      return {
        ...state,
        label: action.payload,
      };
    case 'min':
      return {
        ...state,
        min: action.payload,
      };
    case 'sec':
      return {
        ...state,
        sec: action.payload,
      };
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

const NewTaskForm = ({ addNewItem }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const onInputValueChange = (e, key) => {
    let value = e.target.value;

    if (key === 'sec' && parseInt(value, 10) > 59) {
      value = 59;
    }

    dispatch({ type: `${key}`, payload: value });
  };

  const onLabelChange = (e) => {
    onInputValueChange(e, 'label');
  };

  const onMinValueChange = (e) => {
    onInputValueChange(e, 'min');
  };

  const onSecValueChange = (e) => {
    onInputValueChange(e, 'sec');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (state.label && state.label.length === 0) {
      alert('Заполните описание задачи...');
      return;
    }

    const min = parseInt(state.min, 10) || 0;
    const sec = parseInt(state.sec, 10) || 0;
    const timer = min * 60 + sec;
    addNewItem(state.label, timer);

    dispatch({ type: 'label', payload: '' });
    dispatch({ type: 'min', payload: '' });
    dispatch({ type: 'sec', payload: '' });
  };

  const handleKeyPress = (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      onSubmit(e);
    }
  };

  return (
      <>
        <form className="new-todo-form" onSubmit={onSubmit} onKeyUp={handleKeyPress}>
          <input
              className="new-todo"
              placeholder="Task..."
              autoFocus
              onChange={onLabelChange}
              value={state.label || ''}
          />
          <input
              className="new-todo-form__timer"
              placeholder="Min"
              autoFocus
              type={'number'}
              onChange={onMinValueChange}
              value={state.min}
          />
          <input
              className="new-todo-form__timer"
              placeholder="Sec"
              autoFocus
              type={'number'}
              onChange={onSecValueChange}
              value={state.sec}
          />
        </form>
      </>
  );
}

export default NewTaskForm;
