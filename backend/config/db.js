const mysql = require('mysql2/promise');
require('dotenv').config();

const dbName = process.env.DB_NAME || "rentau_db";


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});


async function initDB() {
    try {
    const tempConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await tempConn.end();

    await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        departamento VARCHAR(10) NOT NULL UNIQUE, 
        password VARCHAR(255) NOT NULL,
        codigo VARCHAR(4) NOT NULL, 
        rol ENUM('admin', 'inquilino') DEFAULT 'inquilino' 
    )
    `);

    await pool.query(`INSERT IGNORE INTO usuarios (nombre, departamento, password, codigo, rol) 
VALUES ('Mia Sánchez', '008', '12345', '2230', 'inquilino')`);

    console.log("Base de datos inicializada: Usuarios cargados exitosamente.");
    } catch (error) {
    console.error("Error inicializando la base de datos:", error.message);
    }
}

initDB();
module.exports = pool;

