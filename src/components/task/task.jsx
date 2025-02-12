import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import './task.scss';

const initialState = {
    label: '',
}

function taskReducer(state, action) {
    switch (action.type) {
        case 'change-label':
            return {
                label: action.payload
            };
        default:
            throw Error('Unknown action: ' + action.type);
    }
}

const Task = ({
                  description,
                  done = false,
                  editing = false,
                  hidden = false,
                  onTogglePropDone,
                  onTogglePropEdit,
                  onDeleted,
                  timeAgo = '0 seconds',
                  changeItemLabel,
                  startTimer,
                  pauseTimer,
                  minutes,
                  seconds
              }) => {

    const [state, dispatch] = useReducer(taskReducer, initialState);

    useEffect(() => {
        dispatch({ type: 'change-label', payload: description });
    }, [editing, description]);

    const handleChange = (event) => {
        dispatch({ type: 'change-label', payload: event.target.value });
    };

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
                        {minutes}:{seconds}
            </span>
                    <span className="description">created {timeAgo} ago</span>
                </label>
                <button className="icon icon-edit" onClick={onTogglePropEdit}></button>
                <button className="icon icon-destroy" onClick={onDeleted}></button>
            </div>
            {className === 'editing' && (
                <form onSubmit={changeItemLabel} className="editing-form">
                    <input type="text" className="edit" value={state.label} onChange={handleChange} autoFocus/>
                </form>
            )}
        </li>
    );
}

Task.propTypes = {
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
}

export default Task;