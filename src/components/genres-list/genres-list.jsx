import React from 'react';
import Genre from '../genre';
import { FilmsGenresConsumer } from '../films-genres-context/index.js';
import { List } from 'antd';
import './genres-list.scss';

const GenresList = () => {
    return (
        <FilmsGenresConsumer>
            {(context) => {
                return (
                    <>
                        <p className={'genres__title'}>
                            На нашем сайте есть фильмы по следующим жанрам:
                        </p>
                        <List className={'genres__list'}>
                            {context.genres.map((item) => (
                                <Genre key={item.id} {...item} />
                            ))}
                        </List>
                    </>
                );
            }}
        </FilmsGenresConsumer>
    );
};

export default GenresList;
