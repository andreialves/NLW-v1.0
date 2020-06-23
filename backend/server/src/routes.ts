import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';



const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();


routes.get('/', (request, response) => {
    return response.json({message : 'Hello World'});
});


routes.get('/items', itemsController.index);
routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;


/*

    Exemplos de código para caso esquecer algum



app.get('/users/:id', (request, response) => {
    console.log ('Retorna apenas um Usuário');
    const id = Number(request.params.id);

    response.json(users[id]);
});

app.get('/users', (request, response) => {
    const search = String(request.query.search);

    const filterdUsers = users.filter(user => user.includes(search));

    return response.json(filterdUsers);
});

app.post('/users', (request, response) =>{
    const data = request.body;

    const user = {
        name: data.name,
        email: data.email
    };

    return response.json(user);
});

*/