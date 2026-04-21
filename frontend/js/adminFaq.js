let selectedFaqId = null;

document.addEventListener('DOMContentLoaded', fetchFaqs);

async function fetchFaqs() {
    const response = await fetch('http://localhost:3000/api/faq');
    const faqs = await response.json();
    const container = document.getElementById('faq-list-container'); 
    container.innerHTML = '';

    faqs.forEach(faq => {
        const div = document.createElement('div');
        div.className = "faq-card bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-4";
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="q-text font-bold text-rentau-navy uppercase text-sm mb-2">${faq.pregunta}</h4>
                    <p class="a-text text-slate-500 text-xs leading-relaxed">${faq.respuesta}</p>
                </div>
                <div class="flex gap-2 ml-4">
                    <button onclick='prepareEdit(${JSON.stringify(faq)})' class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteFaq(${faq.id})" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
        container.appendChild(div);
    });
}

async function saveFaq() {
    const pregunta = document.getElementById('input-pregunta').value;
    const respuesta = document.getElementById('input-respuesta').value;

    if (!pregunta || !respuesta) return alert("Llena todos los campos");

    const response = await fetch('http://localhost:3000/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedFaqId, pregunta, respuesta })
    });

    if (response.ok) {
        alert("¡Guardado correctamente!");
        location.reload();
    }
}

async function deleteFaq(id) {
    if (!confirm("¿Seguro que quieres eliminar esta pregunta?")) return;
    await fetch(`http://localhost:3000/api/faq/${id}`, { method: 'DELETE' });
    fetchFaqs();
}

function prepareEdit(faq) {
    selectedFaqId = faq.id;
    document.getElementById('input-pregunta').value = faq.pregunta;
    document.getElementById('input-respuesta').value = faq.respuesta;
    document.getElementById('btn-submit-faq').innerText = "Actualizar Pregunta";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}