import knex from 'knex';
import path from 'path';

/* Usando o Knex par a configurar a conexão com o DB
 * ///// npm install knex
 * 
 * Usei o SQLite como banco de dados principal
 * ///// npm install sqlite3 
 *  
*/
const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
});

export default connection;