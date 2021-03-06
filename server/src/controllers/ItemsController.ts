import knex from '../database/connection'
import {Request, Response} from 'express'


class ItemsController{
    
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item =>{
            return{ 
                title: item.title,
                image_url: `http://192.168.1.100:3333/uploads/${item.image}`, 
                id: item.id
           }
        });
        return response.json(serializedItems);
    }
}

export default ItemsController;