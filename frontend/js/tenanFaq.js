document.addEventListener('DOMContentLoaded', fetchFaqs);

async function fetchFaqs() {
    const container = document.getElementById('faq-dynamic-container');

    try {
        const response = await fetch('http://localhost:3000/api/faq');
        const faqs = await response.json();

        if (faqs.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-400 py-10">No hay preguntas registradas aún.</p>';
            return;
        }

        container.innerHTML = '';

        faqs.forEach(faq => {
            const item = document.createElement('div');
            item.className = "accordion-item bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden transition-all";

            item.innerHTML = `
                <button class="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors">
                    <span class="font-bold text-rentau-navy text-sm">${faq.pregunta}</span>
                    <i class="fa-solid fa-chevron-down chevron text-slate-300 text-xs transition-transform duration-300"></i>
                </button>
                <div class="accordion-content px-6 text-slate-500 text-sm leading-relaxed">
                    ${faq.respuesta}
                </div>
            `;

            const button = item.querySelector('button');
            button.addEventListener('click', () => {
                document.querySelectorAll('.accordion-item').forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });

                item.classList.toggle('active');
            });

            container.appendChild(item);
        });

    } catch (error) {
        console.error("Error al cargar FAQ:", error);
        container.innerHTML = '<p class="text-center text-red-400 py-10">Error al conectar con el servidor.</p>';
    }
}