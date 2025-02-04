import React, { Component } from 'react';
import FilmsResources from '../../services/films-resources';
import FilmsGenres from '../../services/films-genres';
import TabsList from '../tabs';
import Search from '../search';
import MoviesList from '../movies-list';
import GenresList from '../genres-list';
import { FilmsResourcesProvider } from '../films-resources-context';
import { FilmsGenresProvider } from '../films-genres-context/index.js';
import { Alert, Spin, Pagination } from 'antd';
import { Online, Offline } from 'react-detect-offline';
import err500Dino from './err500.svg';
import './app.scss';

export default class App extends Component {
    state = {
        films: [],
        genres: [],
        genresLoading: true,
        loading: null,
        error: false,
        searchValue: '',
        totalPages: null,
        pageNum: 1,
        activeTab: 'tab1',
    };

    onSearchSubmit = async () => {
        this.setState({ loading: true, error: false });

        try {
            const { results, totalPages } = await FilmsResources(
                this.state.searchValue,
                this.state.pageNum
            );

            this.setState({
                films: results,
                loading: false,
                totalPages,
                error: results.length === 0,
            });
        } catch (error) {
            this.setState({
                loading: false,
                error: true,
            });
        }
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

    async componentDidMount() {
        try {
            const genres = await FilmsGenres();
            this.setState({ genres, genresLoading: false });
        } catch (e) {
            console.error('Ошибка при получении данных о жанрах...');
        }
    }

    render() {
        const { loading, genres, genresLoading, error } = this.state;
        return (
            <>
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
                            {loading === null && this.state.genresLoading ? (
                                <Spin className='loading-spin' />
                            ) : loading === null ? (
                                <FilmsGenresProvider
                                    value={{ genres: this.state.genres }}
                                >
                                    <GenresList genres={this.state.genres} />
                                </FilmsGenresProvider>
                            ) : loading ? (
                                <Spin className='loading-spin' />
                            ) : !error ? (
                                <FilmsResourcesProvider
                                    value={{ films: this.state.films }}
                                >
                                    <MoviesList />
                                </FilmsResourcesProvider>
                            ) : (
                                <Alert
                                    style={{
                                        textAlign: 'center',
                                        marginTop: 20,
                                    }}
                                    message='Ошибка 404!'
                                    description='Данные по вашему запросу отсутствуют...'
                                    type='error'
                                    closable
                                />
                            )}
                            {this.state.totalPages && (
                                <Pagination
                                    className={'pagination'}
                                    align='center'
                                    current={this.state.pageNum}
                                    total={this.state.totalPages * 20}
                                    pageSize={20}
                                    onChange={(page) =>
                                        this.setState({ pageNum: page }, () => {
                                            this.onSearchSubmit();
                                        })
                                    }
                                />
                            )}
                        </>
                    )}
                    {this.state.activeTab === 'tab2' && (
                        <MoviesList
                            films={
                                JSON.parse(localStorage.getItem('rated')) ?? []
                            }
                        />
                    )}
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
            </>
        );
    }
}
