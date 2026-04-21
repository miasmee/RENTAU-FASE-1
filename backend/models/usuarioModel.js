const db = require('../config/db');

class Usuario {
    // Login usando departamento
    static async findByCredentials(departamento, password) {
        const [rows] = await db.execute(
            'SELECT id, nombre, departamento, rol FROM usuarios WHERE departamento = ? AND password = ?',
            [departamento, password]
        );
        return rows;
    }

    // Recuperación usando el código de 4 dígitos
    static async findPasswordByCode(codigo, departamento) {
        const [rows] = await db.execute(
            'SELECT password FROM usuarios WHERE codigo = ? AND departamento = ?',
            [codigo, departamento]
        );
        return rows;
    }
}

module.exports = Usuario;