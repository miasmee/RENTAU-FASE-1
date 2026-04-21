document.addEventListener("DOMContentLoaded", () => {
    const inputFecha = document.getElementById('fecha');
    const errorFecha = document.getElementById('error-fecha');
    const visitaForm = document.getElementById('visita-form');
    let datosUltimaCita = null;

    // 1. Configurar fecha 
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    if (inputFecha) inputFecha.setAttribute('min', mañana.toISOString().split('T')[0]);

    // 2. Validar fines de semana
    if (inputFecha) {
        inputFecha.addEventListener('change', function () {
            const date = new Date(this.value);
            const day = date.getUTCDay();
            if (day === 0 || day === 6) {
                if (errorFecha) errorFecha.classList.remove('hidden');
                this.value = '';
            } else {
                if (errorFecha) errorFecha.classList.add('hidden');
            }
        });
    }

    // 3. Envío
    if (visitaForm) {
        visitaForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                nombre: document.getElementById('nombre').value,
                contacto: document.getElementById('contacto').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('selected-time').value
            };

            if (!formData.hora) {
                alert("Por favor selecciona un horario de visita.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/agendar-visita", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    datosUltimaCita = formData;
                    document.getElementById('confirm-modal').classList.remove('hidden');
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("No se pudo conectar con el servidor.");
            }
        });
    }

    // 4. Lógica de descarga del comprobante en PDF REAL
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!datosUltimaCita) return;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // --- DISEÑO DEL PDF ---
            doc.setFillColor(0, 45, 91);
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("RENTAU", 105, 20, { align: "center" });
            doc.setFontSize(12);
            doc.text("COMPROBANTE DE CITA", 105, 30, { align: "center" });

            doc.setTextColor(60, 60, 60);
            doc.setFontSize(14);
            doc.text("Detalles de la Cita:", 20, 60);

            doc.setDrawColor(226, 232, 240);
            doc.line(20, 65, 190, 65);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            let y = 80;

            const detalles = [
                ["Nombre:", datosUltimaCita.nombre],
                ["Contacto:", datosUltimaCita.contacto],
                ["Fecha:", datosUltimaCita.fecha],
                ["Hora:", datosUltimaCita.hora],
                ["Ubicación:", "Zacatepec, Morelos (Cerca del ITZ)"]
            ];

            detalles.forEach(detalle => {
                doc.setFont("helvetica", "bold");
                doc.text(detalle[0], 20, y);
                doc.setFont("helvetica", "normal");
                doc.text(detalle[1], 60, y);
                y += 12;
            });

            doc.setFillColor(248, 250, 252);
            doc.rect(20, y + 10, 170, 30, 'F');
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text("Recuerda llegar 5 minutos antes de tu cita.", 105, y + 22, { align: "center" });
            doc.text("¡Te esperamos con gusto!", 105, y + 28, { align: "center" });

            doc.setFontSize(8);
            doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 280, { align: "center" });

            const nombreArchivo = `Comprobante_RENTAU_${datosUltimaCita.nombre.replace(/\s+/g, '_')}.pdf`;
            doc.save(nombreArchivo);

            setTimeout(() => window.location.href = 'index.html', 1500);
        });
    }
}); 
function selectTime(btn, time) {
    document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const inputHidden = document.getElementById('selected-time');
    if (inputHidden) inputHidden.value = time;
}