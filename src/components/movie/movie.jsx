import React, { Component } from 'react';
import { Flex, Button, Image, Rate } from 'antd';
import { parseISO, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './movie.scss';
import emptyPicture from './empty-cam.svg';

export default class Movie extends Component {
    state = {
        rating: this.props.rating ?? 0,
    };

    changePreview = (str, max, ellipsis) => {
        if (str.length <= max) return str;
        let trimmed = str.substr(0, max);
        if (str[max] !== ' ') {
            trimmed = trimmed.substr(
                0,
                Math.min(trimmed.length, trimmed.lastIndexOf(' '))
            );
        }
        return trimmed + ellipsis + '...';
    };

    getFormatDate = (time) => {
        try {
            const parseTime = parseISO(time);
            if (isNaN(parseTime)) throw new Error('Ошибка при парсинге даты');
            return format(parseTime, 'LLLL d, yyyy', { locale: ru });
        } catch (err) {
            console.error('Ошибка даты', err);
            return 'Дата публикации...';
        }
    };

    getPosterPath = (poster_path, title) => {
        return poster_path ? (
            <Image
                src={'https://image.tmdb.org/t/p/original' + poster_path}
                width={183}
                className='movies-item__img'
                alt={title}
            />
        ) : (
            <Image
                src={emptyPicture}
                width={183}
                className='movies-item__img'
                alt={'Not found picture'}
            />
        );
    };

    onChangeRating = (value) => {
        this.setState(
            {
                rating: value,
            },
            () => {
                let item = this.props;
                let allItems = [];
                if (localStorage.getItem('rated')) {
                    allItems = [...JSON.parse(localStorage.getItem('rated'))];
                }

                const currentId = allItems.findIndex((i) => i.id === item.id);
                if (currentId !== -1) {
                    allItems[currentId] = {
                        ...item,
                        rating: this.state.rating,
                    };
                } else {
                    const newItem = { ...item, rating: this.state.rating };
                    allItems.push(newItem);
                }

                localStorage.setItem('rated', JSON.stringify(allItems));

                this.forceUpdate();
            }
        );
    };

    getItemRatingValue = () => {
        const currentId = this.props.id;
        const items = JSON.parse(localStorage.getItem('rated')) || [];

        const currentItem = items.find((item) => item.id === currentId);
        return currentItem ? currentItem.rating : this.state.rating;
    };

    render() {
        const {
            original_title,
            poster_path,
            overview,
            release_date,
            vote_average,
        } = this.props;

        const normalizedRating = Number(vote_average).toFixed(1);

        let normalizedRatingClass = '';
        normalizedRating <= 3
            ? (normalizedRatingClass = 'movies-item__rate-num--before-three')
            : normalizedRating <= 5
              ? (normalizedRatingClass = 'movies-item__rate-num--before-five')
              : normalizedRating <= 7
                ? (normalizedRatingClass =
                      'movies-item__rate-num--before-seven')
                : (normalizedRatingClass =
                      'movies-item__rate-num--after-seven');

        return (
            <Flex className='movies-item' gap={19}>
                {this.getPosterPath(poster_path, original_title)}
                <div className='movies-item__info'>
                    <h2 className='movies-item__title'>{original_title}</h2>
                    <span
                        className={`movies-item__rate-num ${normalizedRatingClass}`}
                    >
                        {normalizedRating}
                    </span>
                    <time className='movies-item__date'>
                        {this.getFormatDate(release_date)}
                    </time>
                    <Flex className='movies-item__btns' gap='small' wrap>
                        <Button size='small'>Action</Button>
                        <Button size='small'>Drama</Button>
                    </Flex>
                    <p>{this.changePreview(overview, 200)}</p>
                    <Rate
                        allowHalf
                        value={this.getItemRatingValue()}
                        onChange={this.onChangeRating}
                    />
                </div>
            </Flex>
        );
    }
}
