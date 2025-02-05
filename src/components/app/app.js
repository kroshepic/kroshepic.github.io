import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';

import Header from '../header';
import TaskList from '../task-list';
import Footer from '../footer';

import './app.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.taskTimers = new Map();
    this.checkActiveTimerItem();
  }

  state = {
    data: [],
  };

  static propTypes = {
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
  };

  saveToLocalStorage = () => {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      localStorage.setItem('tasks', JSON.stringify(this.state.data));
    }, 1000);
  };

  syncStateWithLocalStorage = () => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      this.setState({
        data: storedTasks,
      });
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Failed to parse tasks from localStorage. Clearing corrupted data.', error);
      localStorage.removeItem('tasks'); // Очистка некорректных данных
      this.setState({
        data: [],
      });
    }
  };

  handleStorageChange = (event) => {
    if (event.key === 'tasks') {
      const updatedData = JSON.parse(event.newValue);
      this.setState({
        data: updatedData,
      });
      this.saveToLocalStorage();
    }
  };

  handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.saveToLocalStorage();
    }
  };

  componentDidMount = () => {
    this.syncStateWithLocalStorage();
    this.checkActiveTimerItem();

    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        const resData = prevState.data.map((task) => ({
          ...task,
          timeAgo: formatDistanceToNowStrict(new Date(task.created), {
            unit: 'second',
          }),
        }));
        this.saveToLocalStorage();
        return { data: resData };
      });
    }, 1000);

    window.addEventListener('beforeunload', this.saveToLocalStorage);
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('visibilitychange', this.handleVisibilityChange);
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
    this.taskTimers.forEach((intervalId) => clearInterval(intervalId));
    window.removeEventListener('beforeunload', this.saveToLocalStorage);
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('visibilitychange', this.handleVisibilityChange);
  };

  checkActiveTimerItem = () => {
    const arr = this.state.data;
    arr.forEach((item) => {
      if (item.active_timer) {
        this.startTimer(item.id);
      }
    });
  };

  setTaskTimer = (id, minutes, seconds) => {
    this.setState((prevState) => {
      const updatedTasks = prevState.data.map((task) =>
        task.id === id ? { ...task, minutes, seconds, timer: minutes * 60 + seconds } : task
      );
      return { data: updatedTasks };
    });
  };

  startTimer = (id) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, active_timer: true } : task));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    if (this.taskTimers.has(id)) return;

    const intervalId = setInterval(() => {
      this.setState((prevState) => {
        const data = prevState.data.map((task) => {
          if (task.id === id) {
            if (task.timer === 0 && !task.alertShown) {
              alert('Время задачи вышло...');
              task.alertShown = true;
            }
            return { ...task, active_timer: true, timer: Math.max(task.timer - 1, 0) };
          }
          return task;
        });

        localStorage.setItem('tasks', JSON.stringify(data));
        return { data };
      });
    }, 1000);
    this.taskTimers.set(id, intervalId);
  };

  pauseTimer = (id) => {
    this.setState((prevState) => {
      const data = prevState.data.map((task) => (task.id === id ? { ...task, active_timer: false } : task));
      this.saveToLocalStorage();
      return { data };
    });
    if (this.taskTimers.has(id)) {
      clearInterval(this.taskTimers.get(id));
      this.taskTimers.delete(id);
    }
  };

  createItem(description, timer) {
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

  deleteItem = (id) => {
    if (this.taskTimers.has(id)) {
      clearInterval(this.taskTimers.get(id));
      this.taskTimers.delete(id);
    }
    this.setState(
      () => {
        const arr = this.state.data;
        const idx = arr.findIndex((item) => item.id === id);
        return {
          data: [...arr.slice(0, idx), ...arr.slice(idx + 1)],
        };
      },
      () => {
        this.saveToLocalStorage();
      }
    );
  };

  addItem = (value, timer) => {
    this.setState(
      ({ data }) => {
        const newItem = this.createItem(value, timer);
        const resArr = [...data, newItem];
        return {
          data: resArr,
        };
      },
      () => {
        this.saveToLocalStorage();
      }
    );
  };

  changeItem = (e) => {
    e.preventDefault();
    const input = document.querySelector('ul.todo-list > li.editing > form.editing-form > input');
    this.setState(({ data }) => {
      const newArr = [...data];
      newArr.forEach((item) => {
        if (item.editing === true) {
          item.description = input.value;
          item.editing = false;
        }
      });
      this.saveToLocalStorage();
      return {
        data: newArr,
      };
    });
  };

  onToggleProp = (arr, id, prop) => {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = { ...oldItem, [prop]: !oldItem[prop] };
    return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
  };

  onTogglePropDone = (id) => {
    this.setState(({ data }) => {
      return {
        data: this.onToggleProp(data, id, 'done'),
      };
    });
    clearInterval(this.taskTimers.get(id));
    this.saveToLocalStorage();
  };

  onTogglePropEdit = (id) => {
    this.setState(({ data }) => {
      return {
        data: this.onToggleProp(data, id, 'editing'),
      };
    });
    this.saveToLocalStorage();
  };

  addSelectedClass = (num) => {
    const filtersBtns = document.querySelectorAll('.filters li button');

    filtersBtns.forEach((btn) => {
      btn.classList.remove('selected');
    });

    filtersBtns[num].classList.add('selected');
  };

  onSortAll = () => {
    this.addSelectedClass(0);

    this.setState(({ data }) => {
      const resArr = [...data];
      resArr.forEach((item) => {
        item.hidden = false;
      });
      return {
        data: resArr,
      };
    });
    this.saveToLocalStorage();
  };

  onSortActive = () => {
    this.onSortAll();
    this.addSelectedClass(1);
    this.setState(({ data }) => {
      // const resArr = data.filter(item => item.done !== true);
      const resArr = [...data];
      resArr.forEach((item) => {
        if (item.done === true) {
          item.hidden = true;
        }
      });

      return {
        data: resArr,
      };
    });
    this.saveToLocalStorage();
  };

  onSortComplited = () => {
    this.onSortAll();
    this.addSelectedClass(2);

    this.setState(({ data }) => {
      const resArr = [...data];
      resArr.forEach((item) => {
        if (item.done !== true) {
          item.hidden = true;
        }
      });
      return {
        data: resArr,
      };
    });
    this.saveToLocalStorage();
  };

  onClearAllComplited = () => {
    this.setState(({ data }) => {
      const resArr = data.filter((item) => item.done !== true);
      return {
        data: resArr,
      };
    });
    this.saveToLocalStorage();
  };

  render() {
    return (
      <section className="todoapp">
        <Header addNewItem={this.addItem} setTaskTimer={this.setTaskTimer} />

        <section className="main">
          <TaskList
            todos={this.state.data}
            onTogglePropDone={this.onTogglePropDone}
            onTogglePropEdit={this.onTogglePropEdit}
            onDeleted={this.deleteItem}
            changeItemLabel={this.changeItem}
            startTimer={this.startTimer}
            pauseTimer={this.pauseTimer}
          />
        </section>
        <Footer
          todos={this.state.data}
          onAll={this.onSortAll}
          onActive={this.onSortActive}
          onComplited={this.onSortComplited}
          onClearComplited={this.onClearAllComplited}
        />
      </section>
    );
  }
}
