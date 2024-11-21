// lib/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',     
  user: 'root',
  password: '',
  database: 'loudred',
});

db.getConnection()
  .then((connection) => {
    console.log('Conexión exitosa a la base de datos');
    connection.release();
  })
  .catch((err) => {
    console.error('Error en la conexión a la base de datos:', err);
  });
export default db;
