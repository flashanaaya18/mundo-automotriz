document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFECTO DE LA CABECERA AL HACER SCROLL ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. MENÚ MÓVIL ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');

    // Abrir/cerrar menú con el botón
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en un enlace (para móviles)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // --- 3. ANIMACIONES AL HACER SCROLL (Intersection Observer) ---
    // Esta es una forma moderna y eficiente de detectar cuándo un elemento entra en la pantalla.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añade clases de animación a los elementos que ahora son visibles
                entry.target.classList.add('fade-in');
                // Puedes añadir más clases si quieres diferentes animaciones
                // entry.target.classList.add('fade-in-left', 'delay-1');
                observer.unobserve(entry.target); // Dejamos de observar el elemento una vez animado
            }
        });
    }, {
        threshold: 0.1 // La animación se dispara cuando el 10% del elemento es visible
    });

    // Seleccionamos todos los elementos que queremos animar
    const elementsToAnimate = document.querySelectorAll('.card, .tech-item, .gallery-item, .section-title, .contact-form, #historia img, #competicion img, #futuro img');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });


    // --- 4. MANEJO DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
            const formMessage = document.getElementById('form-message');
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            // Recolectamos los datos del formulario
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Usamos fetch para enviar los datos a nuestro servidor Node.js
            fetch('/api/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                // Mostramos el mensaje del servidor en la página
                formMessage.textContent = result.message;

                if (result.success) {
                    formMessage.className = 'form-success mt-2';
                    contactForm.reset(); // Limpiamos el formulario si todo fue bien
                } else {
                    formMessage.className = 'form-error mt-2';
                }
            })
            .catch(error => {
                // Ocurrió un error de red (ej: el servidor no está corriendo)
                console.error('Error al enviar el formulario:', error);
                formMessage.textContent = 'Hubo un problema de conexión. Por favor, inténtalo de nuevo más tarde.';
                formMessage.className = 'form-error mt-2';
            })
            .finally(() => {
                // Esto se ejecuta siempre, haya habido éxito o error
                submitButton.textContent = 'Enviar Mensaje';
                submitButton.disabled = false;
            });
        });
    }
});