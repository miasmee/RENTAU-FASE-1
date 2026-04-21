let selectedFaqId = null;
let idToDelete = null;

document.addEventListener('DOMContentLoaded', fetchFaqs);

function showModal(title, desc, isError = false) {
    const modal = document.getElementById('notification-modal');
    const iconContainer = document.getElementById('modal-icon-container');
    const icon = document.getElementById('modal-icon');

    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;

    if (isError) {
        iconContainer.className = "w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner";
        icon.className = "fa-solid fa-xmark";
    } else {
        iconContainer.className = "w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner";
        icon.className = "fa-solid fa-check";
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    document.getElementById('notification-modal').classList.add('hidden');
    document.getElementById('notification-modal').classList.remove('flex');
}

// CONFIRMACIÓN DE BORRADO ---
function deleteFaq(id) {
    idToDelete = id; // Guardamos el ID temporalmente
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.classList.remove('hidden');
    confirmModal.classList.add('flex');

    document.getElementById('btn-confirm-delete').onclick = async function () {
        await executeDelete();
    };
}

function closeConfirmModal() {
    idToDelete = null;
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.classList.add('hidden');
    confirmModal.classList.remove('flex');
}

async function executeDelete() {
    try {
        const response = await fetch(`http://localhost:3000/api/faq/${idToDelete}`, { method: 'DELETE' });
        if (response.ok) {
            closeConfirmModal();
            showModal("Eliminado", "La pregunta ha sido borrada del sistema.");
            fetchFaqs();
        }
    } catch (error) {
        showModal("Error", "No se pudo eliminar la pregunta.", true);
    }
}

// --- LÓGICA DE DATOS ---
async function fetchFaqs() {
    try {
        const response = await fetch('http://localhost:3000/api/faq');
        const faqs = await response.json();
        const container = document.getElementById('faq-list');
        container.innerHTML = '';

        if (faqs.length === 0) {
            container.innerHTML = `<p class="text-center text-slate-400 py-10">No hay preguntas registradas.</p>`;
            return;
        }

        faqs.forEach(faq => {
            const card = document.createElement('div');
            card.className = "faq-card bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start mb-4";
            card.innerHTML = `
                <div class="flex-grow">
                    <h3 class="font-bold text-rentau-navy text-lg uppercase">${faq.pregunta}</h3>
                    <p class="text-sm text-slate-500 mt-2">${faq.respuesta}</p>
                </div>
                <div class="flex gap-2 ml-4">
                    <button onclick='prepareEdit(${JSON.stringify(faq)})' class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="deleteFaq(${faq.id})" class="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>`;
            container.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

async function saveFaq() {
    const pregunta = document.getElementById('input-pregunta').value;
    const respuesta = document.getElementById('input-respuesta').value;

    try {
        const response = await fetch('http://localhost:3000/api/faq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedFaqId, pregunta, respuesta })
        });

        if (response.ok) {
            showModal(
                selectedFaqId ? "¡Actualizado!" : "¡Guardado!",
                selectedFaqId ? "La pregunta ha sido actualizada correctamente." : "La pregunta se ha publicado con éxito."
            );
            resetForm();
            fetchFaqs();
        }
    } catch (error) {
        showModal("Error", "Problema de conexión.", true);
    }
}

function prepareEdit(faq) {
    selectedFaqId = faq.id;
    document.getElementById('input-pregunta').value = faq.pregunta;
    document.getElementById('input-respuesta').value = faq.respuesta;
    document.getElementById('form-title').innerText = "Editando Pregunta";
    document.getElementById('form-icon').className = "w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center";
    const btn = document.getElementById('btn-submit-faq');
    btn.innerText = "Actualizar Cambios";
    btn.className = "bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-[11px] shadow-md transition-all";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    selectedFaqId = null;
    document.getElementById('faq-form').reset();
    document.getElementById('form-title').innerText = "Agregar Nueva Pregunta";
    document.getElementById('form-icon').className = "w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center";
    const btn = document.getElementById('btn-submit-faq');
    btn.innerText = "Guardar Pregunta";
    btn.className = "bg-rentau-navy text-white px-8 py-3 rounded-xl font-bold uppercase text-[11px] shadow-md transition-all";
}