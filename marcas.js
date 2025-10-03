document.addEventListener('DOMContentLoaded', () => {
    // --- EFECTO DE LA CABECERA AL HACER SCROLL ---
    // Reutilizado de script.js para asegurar que funcione
    // si script.js no se carga o se carga después.
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});