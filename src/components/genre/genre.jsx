import React, { Component } from 'react';
import './genre.scss';

export default class Genre extends Component {
    render() {
        const { id, name } = this.props;
        return (
            <li className={'genres__item'} id={id}>
                {name}
            </li>
        );
    }
}
