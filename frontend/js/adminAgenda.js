let allVisits = [];
let visitIdToDelete = null;
let visitToConfirm = null;

document.addEventListener('DOMContentLoaded', async () => {
    await fetchVisits();
});

// 1. OBTENER DATOS DEL SERVIDOR
async function fetchVisits() {
    try {
        const response = await fetch('http://localhost:3000/api/visitas');
        if (!response.ok) throw new Error("Error al obtener visitas");

        allVisits = await response.json();

        const activeBtn = document.querySelector('.filter-btn.active');
        const currentType = activeBtn ? activeBtn.innerText.toUpperCase() : 'TODAS';

        filterVisits(currentType, activeBtn);

    } catch (error) {
        console.error("Error en fetchVisits:", error);
    }
}

// 2. FILTRADO LÓGICO
function filterVisits(type, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let filtered = allVisits.filter(visit => {
        const fechaCita = new Date(visit.fecha);
        fechaCita.setHours(0, 0, 0, 0);

        if (type === 'TODAS') return true;
        if (type === 'HOY') return fechaCita.getTime() === hoy.getTime();

        if (type === 'ESTA SEMANA') {
            const finSemana = new Date(hoy);
            finSemana.setDate(hoy.getDate() + 7);
            return fechaCita >= hoy && fechaCita <= finSemana;
        }

        if (type === 'MES') {
            return fechaCita.getMonth() === hoy.getMonth() &&
                fechaCita.getFullYear() === hoy.getFullYear();
        }
        return true;
    });

    renderVisits(filtered);
}

// 3. RENDERIZADO DE TARJETAS
function renderVisits(visits) {
    const container = document.getElementById('visits-container');
    if (!container) return;
    container.innerHTML = '';

    if (visits.length === 0) {
        container.innerHTML = `<div class="col-span-full py-20 text-center text-slate-400 italic">No hay citas en esta sección.</div>`;
        return;
    }

    visits.forEach(visit => {
        const isConfirmed = visit.estado === 'confirmada';
        const card = document.createElement('div');

        card.className = `visit-card bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col transition-all 
                        ${isConfirmed ? 'opacity-60 grayscale' : ''}`;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-rentau-navy">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="flex gap-2 items-center">
                    <span class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 ${isConfirmed ? 'bg-slate-200 text-slate-600' : 'bg-blue-50 text-blue-600'} rounded-full">
                        ${visit.estado || 'Pendiente'}
                    </span>
                    <button onclick="openDeleteModal(${visit.id})" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all">
                        <i class="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                </div>
            </div>

            <h3 class="font-bold text-rentau-navy uppercase text-sm mb-1">${visit.nombre}</h3>
            <p class="text-[10px] text-slate-400 mb-4 font-medium">${visit.contacto || 'Sin contacto'}</p>
            
            <div class="flex gap-4 py-3 border-t border-slate-50 mt-auto">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-calendar text-rentau-gold text-[10px]"></i>
                    <span class="text-[10px] font-bold text-slate-600">${new Date(visit.fecha).toLocaleDateString('es-MX')}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-clock text-rentau-gold text-[10px]"></i>
                    <span class="text-[10px] font-bold text-slate-600">${visit.hora}</span>
                </div>
            </div>

            ${!isConfirmed ? `
                <button onclick="openConfirmModal(${visit.id})" class="w-full mt-4 py-3 bg-rentau-navy text-white rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-rentau-gold hover:text-rentau-navy transition-all shadow-md">
                    Confirmar Visita
                </button>
            ` : ''}
        `;
        container.appendChild(card);
    });
}

// --- 4. MODAL DE ELIMINACIÓN ---
function openDeleteModal(id) {
    visitIdToDelete = id;
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.add('active'); 
}

function closeDeleteModal() {
    visitIdToDelete = null;
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.remove('active');
}

async function executeDelete() {
    const cleanId = String(visitIdToDelete).split(':')[0];

    if (!cleanId) {
        console.error("ID no válido");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/visitas/${cleanId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            closeDeleteModal();
            await fetchVisits();
            console.log("Eliminado con éxito");
        } else {
            const errorText = await response.text();
            console.error("Respuesta del servidor:", errorText);
            alert("El servidor no pudo procesar la eliminación.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión. ¿Está el servidor encendido?");
    }
}

// --- 5. MODAL DE CONFIRMACIÓN ---
function openConfirmModal(id) {
    visitToConfirm = id;
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    visitToConfirm = null;
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.remove('active');
}

async function confirmVisitAction() {
    if (!visitToConfirm) return;
    try {
        const res = await fetch(`http://localhost:3000/api/visitas/${visitToConfirm}/confirmar`, {
            method: 'PUT'
        });
        if (res.ok) {
            closeModal();
            await fetchVisits();
        }
    } catch (e) {
        console.error("Error confirmando visita:", e);
    }
}