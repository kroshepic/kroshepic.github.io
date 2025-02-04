import React from 'react';
import { FilmsResourcesConsumer } from '../films-resources-context/index.js';
import Movie from '../movie/index.js';
import { Flex } from 'antd';
import './movies-list.scss';

const MoviesList = ({ films }) => {
    return (
        <FilmsResourcesConsumer>
            {(context) => {
                const movies = films || context.films;
                return (
                    <Flex
                        className='movies-list'
                        gap={36}
                        wrap='wrap'
                        justify={'space-between'}
                    >
                        {movies.map((film) => (
                            <Movie key={film.id} {...film} />
                        ))}
                    </Flex>
                );
            }}
        </FilmsResourcesConsumer>
    );
};

/*


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
 */

export default MoviesList;
