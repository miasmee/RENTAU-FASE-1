document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let current = 0;
    let timer;

    function show(i) {
        slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
        current = i;
    }

    function next() { 
        show((current + 1) % slides.length); 
    }

    function start() { 
        timer = setInterval(next, 5000); 
    }

    function reset() { 
        clearInterval(timer); 
        start(); 
    }

    dots.forEach(d => d.addEventListener('click', () => {
        show(parseInt(d.dataset.index, 10));
        reset();
    }));

    start();
});