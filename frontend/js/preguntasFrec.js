document.addEventListener('DOMContentLoaded', fetchFaqsForTenant);

async function fetchFaqsForTenant() {
    const container = document.getElementById('faq-accordion-container');

    try {
        const response = await fetch('http://localhost:3000/api/faq');
        const faqs = await response.json();

        if (faqs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                    <p class="text-slate-400 italic">Por el momento no hay preguntas frecuentes publicadas.</p>
                </div>`;
            return;
        }

        container.innerHTML = ''; 

        faqs.forEach(faq => {
            const item = document.createElement('div');
            item.className = "accordion-item bg-white border border-slate-100 rounded-[2rem] px-8 overflow-hidden shadow-sm";

            item.innerHTML = `
                <button class="w-full flex justify-between items-center py-7 text-left group transition-all">
                    <span class="text-sm font-bold text-rentau-navy group-hover:text-rentau-gold transition-colors uppercase tracking-tight">${faq.pregunta}</span>
                    <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-all group-hover:bg-rentau-gold/10">
                        <i class="fa-solid fa-plus text-[10px] text-slate-400 transition-transform duration-300"></i>
                    </div>
                </button>
                <div class="accordion-content">
                    <p class="text-sm text-slate-500 leading-relaxed pb-8 pr-12">${faq.respuesta}</p>
                </div>`;

            item.querySelector('button').addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                document.querySelectorAll('.accordion-item').forEach(other => {
                    other.classList.remove('active');
                    other.querySelector('.accordion-content').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    const content = item.querySelector('.accordion-content');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });

            container.appendChild(item);
        });

    } catch (error) {
        console.error("Error al cargar FAQ:", error);
        container.innerHTML = `<p class="text-center text-red-400">Error al conectar con el servidor.</p>`;
    }
}

document.getElementById('faq-search').addEventListener('input', function (e) {
    const term = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.accordion-item');

    items.forEach(item => {
        const questionText = item.querySelector('span').innerText.toLowerCase();
        const answerText = item.querySelector('.accordion-content p').innerText.toLowerCase();

        if (questionText.includes(term) || answerText.includes(term)) {
            item.style.display = "block";
            item.style.opacity = "1";
        } else {
            item.style.display = "none";
            item.style.opacity = "0";
        }
    });

    const noResults = document.getElementById('no-results-msg');
    const anyVisible = Array.from(items).some(i => i.style.display === "block");

    if (!anyVisible) {
        if (!noResults) {
            const msg = document.createElement('p');
            msg.id = 'no-results-msg';
            msg.className = "text-center text-slate-400 py-10 italic";
            msg.innerText = "No se encontraron resultados para tu búsqueda.";
            document.getElementById('faq-accordion-container').appendChild(msg);
        }
    } else if (noResults) {
        noResults.remove();
    }
});