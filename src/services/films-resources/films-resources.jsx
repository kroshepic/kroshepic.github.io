import { Alert } from 'antd';
import React from 'react';
import App from '../../components/app';

const FilmsResources = async (query) => {
    try {
        const pageNum = 1;
        const url = `https://api.themoviedb.org/3/search/movie?query=${query}&page=${pageNum.toString()}`;
        const _apiKey =
            'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZWVjZDEwM2M4OGUyMjYyMDhjOTM4OTIyODZlNzQ4ZCIsIm5iZiI6MTczNzM3MTY5MS4xNSwic3ViIjoiNjc4ZTMwMmI4NTlmYjRlNmE4NmUyNDkxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.DqFyVfGKxcFrjV573VbA7uyBRIc_Etl7qr41N5rcnoY';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${_apiKey}`,
            },
        };

        const responce = await fetch(url, options);
        if (!responce.ok) throw new Error('Ошибка при попытке fetch запроса!');
        const res = await responce.json();
        return res.results;
    } catch (err) {
        console.error('Ошибка...');
        return (
            <Alert
                style={{ textAlign: 'center', marginTop: 20 }}
                message={err.status}
                description={err.message}
                type='error'
                closable
            />
        );
    }
};

export default FilmsResources;
