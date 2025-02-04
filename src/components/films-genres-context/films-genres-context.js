import React from 'react';

const { Provider: FilmsGenresProvider, Consumer: FilmsGenresConsumer } =
    React.createContext();

export { FilmsGenresProvider, FilmsGenresConsumer };
