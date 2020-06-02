import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('Listagem dos Usuários');

    response.json([
        'Diego',
        'Andrei',
        'Tonico',
        'Alfredo',
        'Judit'
    ]);
});

app.listen(3333);