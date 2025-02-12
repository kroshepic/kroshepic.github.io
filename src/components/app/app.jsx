import React, { useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {formatDistanceToNowStrict} from 'date-fns';

import Header from '../header';
import TaskList from '../task-list';
import Footer from '../footer';

import './app.scss';

function appReducer(state, action) {
    switch(action.type) {
        case 'updateData': {
            return {
                ...state,
                data: action.payload,
            }
        }
        default:
            throw Error('Unknown action: ' + action.type);
    }
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const App = () => {

    const [state, dispatch] = useReducer(appReducer, { data: [] });
    const prevStateRef = useRef();
    const taskTimers = useRef(new Map());

    useEffect(() => {
        prevStateRef.current = state;
    }, [state]);

    useInterval(() => {
        updateTaskTimes();
    }, 1000);

    useEffect(() => {
        const savedData = localStorage.getItem('taskTimers');
        if (savedData) {
            dispatch({ type: 'updateData', payload: JSON.parse(savedData) });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('taskTimers', JSON.stringify(state.data));
    }, [state.data]);


    const updateTaskTimes = () => {
        const updatedTasks = state.data.map((task) => ({
            ...task,
            timeAgo: formatDistanceToNowStrict(new Date(task.created), { unit: 'second' }),
        }));
        dispatch({ type: 'updateData', payload: updatedTasks });
    };

    const setTaskTimer = (id, minutes, seconds) => {
        const updatedTasks = state.data.map((task) =>
            task.id === id ? { ...task, minutes, seconds, timer: minutes * 60 + seconds } : task
        );
        dispatch({ type: 'updateData', payload: updatedTasks });
    };

    const startTimer = (id) => {
        if (taskTimers.current.has(id)) {
            clearInterval(taskTimers.current.get(id));
        }

        const intervalId = setInterval(() => {
            const prevState = prevStateRef.current;
            dispatch({
                type: 'updateData',
                payload: prevState.data.map((task) => {
                    if (task.id === id) {
                        return { ...task, active_timer: true, timer: Math.max(task.timer - 1, 0) };
                    }
                    return task;
                })
            });
        }, 1000);

        taskTimers.current.set(id, intervalId);
    };

    const pauseTimer = (id) => {
        const resArr = state.data.map((task) => (task.id === id ? { ...task, active_timer: false } : task));
        dispatch({ type: 'updateData', payload: resArr });

        if (taskTimers.current.has(id)) {
            clearInterval(taskTimers.current.get(id));
            taskTimers.current.delete(id);
        }
    };

    function createItem(description, timer) {
        return {
            id: Math.random(),
            description,
            created: Date.now(),
            done: false,
            editing: false,
            hidden: false,
            timer,
            active_timer: false,
        };
    }

    const addItem = (value, timer) => {
        const data = state.data;
        const newItem = createItem(value, timer);
        const resArr = [...data, newItem];

        dispatch({ type: 'updateData', payload: resArr });
    };

    const deleteItem = (id) => {
        if (taskTimers.current.has(id)) {
            clearInterval(taskTimers.current.get(id));
            taskTimers.current.delete(id);
        }

        const arr = state.data;
        const idx = arr.findIndex((item) => item.id === id);

        const resArr = [...arr.slice(0, idx), ...arr.slice(idx + 1)]
        dispatch({ type: 'updateData', payload: resArr });
    };

    const changeItem = (e) => {
        e.preventDefault();
        const input = document.querySelector('ul.todo-list > li.editing > form.editing-form > input');

        const newArr = [...state.data];

        newArr.forEach((item) => {
            if (item.editing === true) {
                item.description = input.value;
                item.editing = false;
            }
        });

        dispatch({ type: 'updateData', payload: newArr });
    };

    const onToggleProp = (arr, id, prop) => {
        const idx = arr.findIndex((el) => el.id === id);
        const oldItem = arr[idx];
        const newItem = {...oldItem, [prop]: !oldItem[prop]};

        return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
    };

    const onTogglePropDone = (id) => {
        const data = state.data;
        const resData = onToggleProp(data, id, 'done');
        pauseTimer(id);

        dispatch({ type: 'updateData', payload: resData });
        if(taskTimers.current.has(id)) clearInterval(taskTimers.current.get(id));
    };

    const onTogglePropEdit = (id) => {
        const resData = state.data.map((task) => {
            if (task.id === id) {
                return { ...task, editing: true }
            }
            return task;
        });

        dispatch({ type: 'updateData', payload: resData });
    };

    const addSelectedClass = (num) => {
        const filtersBtns = document.querySelectorAll('.filters li button');

        filtersBtns.forEach((btn) => {
            btn.classList.remove('selected');
        });

        filtersBtns[num].classList.add('selected');
    };

    const onSortAll = () => {
        addSelectedClass(0);

        const resData = state.data.map((item) => {
            return { ...item, hidden: false };
        });

        dispatch({ type: 'updateData', payload: resData });
    };

    const onSortActive = () => {
        onSortAll();
        addSelectedClass(1);

        const resArr = state.data.map((item) => {
            if (item.done === true) {
                return { ...item, hidden: true };
            }
            return { ...item, hidden: false };
        });

        dispatch({ type: 'updateData', payload: resArr });

    };

    const onSortComplited = () => {
        onSortAll();
        addSelectedClass(2);

        const resArr = state.data.map((item) => {
            if (item.done !== true) {
                return { ...item, hidden: true };
            }
            return { ...item, hidden: false };
        });

        dispatch({ type: 'updateData', payload: resArr });
    };

    const onClearAllComplited = () => {
        const resArr = state.data.filter((item) => item.done !== true);

        dispatch({ type: 'updateData', payload: resArr });
    };

    return (
        <section className="todoapp">
            <Header addNewItem={addItem} setTaskTimer={setTaskTimer}/>

            <section className="main">
                <TaskList
                    todos={state.data}
                    onTogglePropDone={onTogglePropDone}
                    onTogglePropEdit={onTogglePropEdit}
                    onDeleted={deleteItem}
                    changeItemLabel={changeItem}
                    startTimer={startTimer}
                    pauseTimer={pauseTimer}
                />
            </section>

            <Footer
                todos={state.data}
                onAll={onSortAll}
                onActive={onSortActive}
                onComplited={onSortComplited}
                onClearComplited={onClearAllComplited}
            />
        </section>
    );
}

App.propTypes = {
    todos: PropTypes.array,
    deleteItem: PropTypes.func,
    createItem: PropTypes.func,
    addItem: PropTypes.func,
    onToggleProp: PropTypes.func,
    onTogglePropDone: PropTypes.func,
    onTogglePropEdit: PropTypes.func,
    addSelectedClass: PropTypes.func,
    onSortActive: PropTypes.func,
    onSortAll: PropTypes.func,
    onSortComplited: PropTypes.func,
    onClearAllComplited: PropTypes.func,
}
export default App;