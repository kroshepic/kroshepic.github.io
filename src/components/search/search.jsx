import React, { Component } from 'react';
import { Input, Form } from 'antd';
import './search.scss';

export default class Search extends Component {
    timer = null;

    onSubmit = () => {
        if (this.props.value.length !== 0) this.props.onSubmit();
    };

    onLabelChange = (e) => {
        this.props.onChange(e.target.value);

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            if (e.target.value.length !== 0) this.onSubmit();
        }, 1000);
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <Form className={'search__form'} onFinish={this.onSubmit}>
                <Input
                    className={'search__input'}
                    type={'text'}
                    placeholder={'Пожалуйста, введите запрос...'}
                    value={this.props.value}
                    onChange={this.onLabelChange}
                />
            </Form>
        );
    }
}
