const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db"); 
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "../frontend")));

// --- 1. MÓDULO: AGENDA DE VISITAS ---
// AGENDAR NUEVA VISITA
app.post("/api/agendar-visita", async (req, res) => {
    const { nombre, contacto, fecha, hora } = req.body;
    const query = "INSERT INTO visitas (nombre, contacto, fecha, hora) VALUES (?, ?, ?, ?)";
    try {
        await db.query(query, [nombre, contacto, fecha, hora]);
        res.json({ success: true, message: "Cita registrada con éxito" });
    } catch (error) {
        console.error("Error al insertar visita:", error);
        res.status(500).json({ success: false, message: "Error al guardar la cita" });
    }
});

// OBTENER TODAS LAS VISITAS
app.get("/api/visitas", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM visitas ORDER BY fecha ASC, hora ASC");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener visitas:", error);
        res.status(500).json({ error: "Error al obtener las visitas" });
    }
});

// CONFIRMAR VISITA (ACTUALIZAR ESTADO)
app.put("/api/visitas/:id/confirmar", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE visitas SET estado = 'confirmada' WHERE id = ?", [id]);
        res.json({ success: true, message: "Visita confirmada exitosamente" });
    } catch (error) {
        console.error("Error al confirmar visita:", error);
        res.status(500).json({ error: "No se pudo actualizar el estado" });
    }
});

// ELIMINAR VISITA
app.delete("/api/visitas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM visitas WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Cita eliminada correctamente" });
        } else {
            res.status(500).send("Error en la base de datos");        }
    } catch (error) {
        console.error("Error al eliminar visita:", error);
        res.status(500).json({ success: false, message: "Error interno en el servidor" });
    }
});

// --- 2. MÓDULO: CENTRO DE AYUDA (FAQ) ---
// OBTENER TODAS LAS FAQ
app.get("/api/faq", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM faq ORDER BY pregunta ASC");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener FAQ:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// CREAR O ACTUALIZAR FAQ
app.post("/api/faq", async (req, res) => {
    const { id, pregunta, respuesta } = req.body;
    try {
        if (id) {
            await db.query("UPDATE faq SET pregunta = ?, respuesta = ? WHERE id = ?", [pregunta, respuesta, id]);
        } else {
            await db.query("INSERT INTO faq (pregunta, respuesta) VALUES (?, ?)", [pregunta, respuesta]);
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Error al guardar FAQ:", error);
        res.status(500).json({ success: false });
    }
});

// ELIMINAR FAQ
app.delete("/api/faq/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM faq WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (error) {
        console.error("Error al eliminar FAQ:", error);
        res.status(500).json({ success: false });
    }
});

// --- 3. RUTAS DE AUTENTICACIÓN ---
app.use("/api", authRoutes);

// --- 4. INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});