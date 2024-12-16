import React from "react";

import "./app.css";

import AppHeader from "../app-header";
import Main from "../app-main";
import Footer from "../app-footer";

const App = () => {
    return (
        <section className="todoapp">
            <AppHeader/>

            <section className="main">
                <Main/>
            </section>

            <Footer />
        </section>
    );
};

export default App;