DROP DATABASE rentau_db; 
CREATE DATABASE rentau_db;
USE rentau_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    departamento VARCHAR(10) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    codigo VARCHAR(4) NOT NULL,             
    rol ENUM('admin', 'inquilino') DEFAULT 'inquilino'
);

INSERT INTO usuarios (nombre, departamento, password, codigo, rol) 
VALUES ('Mia Sánchez', '008', '12345', '2230', 'inquilino');

INSERT INTO usuarios (nombre, departamento, password, codigo, rol) 
VALUES ('admin', 'admin', '0000', '0000', 'admin');

select * from usuarios;

CREATE TABLE visitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(15) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,
    estado ENUM('pendiente', 'confirmada') DEFAULT 'pendiente'
);

select * from visitas;

CREATE TABLE faq (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from faq; 
show tables; 