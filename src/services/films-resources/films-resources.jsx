import { Alert } from 'antd';
import React from 'react';

const FilmsResources = async (query, pageNum) => {
    try {
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

        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Ошибка при попытке fetch запроса!');
        const res = await response.json();
        console.log('length: ', res.results.length);
        return {
            results: res.results,
            totalPages: res.total_pages,
            totalResults: res.total_results,
        };
    } catch (err) {
        console.error('Ошибка в запросе к фильмам...');
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
