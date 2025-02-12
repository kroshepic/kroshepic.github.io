import React from 'react';

import './header.scss';

import NewTaskForm from '../new-task-form';

const Header = ({ addNewItem, setTaskTimer }) => {
    return (
        <header className="header">
            <h1>todos</h1>
            <NewTaskForm addNewItem={addNewItem} setTaskTimer={setTaskTimer} />
        </header>
    );
}

export default Header;