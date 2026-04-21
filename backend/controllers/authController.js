const Usuario = require('../models/usuarioModel');

const login = async (req, res) => {
    const { departamento, password } = req.body;
    try {
        const rows = await Usuario.findByCredentials(departamento, password);
        if (rows.length > 0) {
            res.json({ success: true, usuario: rows[0] });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

const recuperarContrasena = async (req, res) => {
    const { departamento, codigo } = req.body;
    try {
        const filas = await Usuario.findPasswordByCode(codigo, departamento);
        if (filas.length > 0) {
            res.json({ success: true, password: filas[0].password });
        } else {
            res.status(404).json({ success: false, message: "Código o departamento incorrectos" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al recuperar" });
    }
};

//GUARDAR la cita (desde agendaVisita.html)
const agendarVisita = async (req, res) => {
    const { nombre, contacto, fecha, hora } = req.body;
    const sql = "INSERT INTO visitas (nombre, contacto, fecha, hora) VALUES (?, ?, ?, ?)";
    
    try {
        await db.query(sql, [nombre, contacto, fecha, hora]);
        res.json({ success: true, message: "Cita guardada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error en la base de datos" });
    }
};

//LEER las citas (para agenda.html)
const obtenerVisitas = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM visitas WHERE estado = 'pendiente' ORDER BY fecha ASC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

//Exportar
module.exports = {
    login,
    recuperarContrasena,
    agendarVisita, 
    obtenerVisitas
};