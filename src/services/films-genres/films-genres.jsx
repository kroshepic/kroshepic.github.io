import React from 'react';
import { Alert } from 'antd';

const FilmsGenres = async () => {
    try {
        const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
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
        const res = await response.json();
        return res.genres;
    } catch (e) {
        console.error('Ошибка в запросе к жанрам...');
        return (
            <Alert
                style={{ textAlign: 'center', marginTop: 20 }}
                message={e.status}
                description={e.message}
                type='error'
                closable
            />
        );
    }
};

export default FilmsGenres;
