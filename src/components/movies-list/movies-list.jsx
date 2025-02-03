import React from 'react';
import './movies-list.scss';
import Movie from '../movie/index.js';
import { Flex } from 'antd';

const MoviesList = ({ films }) => {
    const elems = films.map((film) => {
        return <Movie key={film.id} {...film} />;
    });
    return (
        <Flex
            className='movies-list'
            gap={36}
            wrap='wrap'
            justify={'space-between'}
        >
            {elems}
        </Flex>
    );
};

export default MoviesList;
