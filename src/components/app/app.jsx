import React, { Component } from 'react';
import FilmsResources from '../../services/films-resources';
import TabsList from '../tabs';
import Search from '../search';
import MoviesList from '../movies-list';
import { Alert, Spin, Pagination } from 'antd';
import { Online, Offline } from 'react-detect-offline';
import err500Dino from './err500.svg';
import './app.scss';

export default class App extends Component {
    state = {
        films: [],
        loading: null,
        error: false,
        searchValue: '',
        activeTab: 'tab1',
    };

    onSearchSubmit = async () => {
        this.setState({ loading: true, error: false });

        try {
            const data = await FilmsResources(this.state.searchValue);

            this.setState({
                films: data,
                loading: false,
                error: data.length === 0,
            });
        } catch (error) {
            this.setState({
                loading: false,
                error: true,
            });
        }
    };

    resultRenderFunc = (loading, error) => {
        if (loading === null)
            return <p className={'null-response-text'}>Введите запрос...</p>;
        return loading ? (
            <Spin className='loading-spin' />
        ) : !error ? (
            /*<MoviesList films={this.putRateProp(this.state.films)} />*/
            <MoviesList films={this.state.films} />
        ) : (
            <Alert
                style={{ textAlign: 'center', marginTop: 20 }}
                message='Ошибка 404!'
                description='Данные по вашему запросу отсутствуют...'
                type='error'
                closable
            />
        );
    };

    handleTabChange = () => {
        let nextTab = '';
        this.state.activeTab === 'tab1'
            ? (nextTab = 'tab2')
            : (nextTab = 'tab1');
        this.setState({
            activeTab: nextTab,
        });
    };

    render() {
        const { loading, error } = this.state;
        return (
            <React.Fragment>
                <Online>
                    <TabsList
                        className={'tabs'}
                        onTabChange={() => this.handleTabChange()}
                    />
                    {this.state.activeTab === 'tab1' && (
                        <>
                            <Search
                                className={'search'}
                                value={this.state.searchValue}
                                onChange={(value) =>
                                    this.setState({ searchValue: value })
                                }
                                onSubmit={this.onSearchSubmit}
                            />
                            {this.resultRenderFunc(loading, error)}
                        </>
                    )}
                    {this.state.activeTab === 'tab2' && (
                        <MoviesList
                            films={
                                JSON.parse(localStorage.getItem('rated')) ?? []
                            }
                        />
                    )}
                    <Pagination
                        className={'pagination'}
                        align='center'
                        defaultCurrent={1}
                        total={4}
                    />
                </Online>
                <Offline>
                    <img
                        className={'error-dino-pic'}
                        src={err500Dino}
                        alt={'Dino err'}
                    />
                    <Alert
                        className={'error-dino-text'}
                        type={'error'}
                        message={'Error 500'}
                        description='Проблемы с сервером. Повторите попытку позже...'
                    />
                </Offline>
            </React.Fragment>
        );
    }
}
