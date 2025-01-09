import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './app.css';
import { formatDistanceToNowStrict } from 'date-fns';

import Header from '../header';
import TaskList from '../task-list';
import Footer from '../footer';

const message = 'Hello, world!';

export default class App extends Component {
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

  componentDidMount = () => {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        const resData = prevState.data.map((task) => ({
          ...task,
          timeAgo: formatDistanceToNowStrict(new Date(task.created), {
            unit: 'second',
          }),
        }));
        //console.log(typeof(resData[0]['timeAgo']))
        return { data: resData };
      });
    }, 5000);
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  };

  deleteItem = (id) => {
    this.setState(() => {
      const arr = this.state.data;
      const idx = arr.findIndex((item) => item.id === id);
      return {
        data: [...arr.slice(0, idx), ...arr.slice(idx + 1)],
      };
    });
  };

  createItem(description) {
    return {
      id: Math.random(),
      description,
      created: Date.now(),
      done: false,
      editing: false,
      hidden: false,
    };
  }

  addItem = (value) => {
    this.setState(({ data }) => {
      const newItem = this.createItem(value);
      const resArr = [...data, newItem];
      return {
        data: resArr,
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
  };

  onTogglePropEdit = (id) => {
    this.setState(({ data }) => {
      return {
        data: this.onToggleProp(data, id, 'editing'),
      };
    });
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
  };

  onClearAllComplited = () => {
    this.setState(({ data }) => {
      const resArr = data.filter((item) => item.done !== true);
      return {
        data: resArr,
      };
    });
  };

  render() {
    return (
      <section className="todoapp">
        <Header addNewItem={this.addItem} />

        <section className="main">
          <TaskList
            todos={this.state.data}
            onTogglePropDone={this.onTogglePropDone}
            onTogglePropEdit={this.onTogglePropEdit}
            onDeleted={this.deleteItem}
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
