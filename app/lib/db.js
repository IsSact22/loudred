// lib/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '192.168.0.103',     
  user: 'admin',
  password: 'qaz951-20',
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
