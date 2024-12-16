import React from "react";

import "./app-header.css";

const AppHeader = () => {
    return (
        <header className="header">
            <h1>todos</h1>
            <input className="new-todo" placeholder="What needs to be done?" autoFocus/>
        </header>
    );
};

export default AppHeader;