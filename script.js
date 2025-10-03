document.addEventListener('DOMContentLoaded', () => {
    // --- MEGA ACTUALIZACIÓN: Cargar Artículos del Blog ---
    const postsContainer = document.getElementById('posts-container');

    const fetchPosts = async () => {
        if (!postsContainer) return; // No hacer nada si el contenedor no existe

        try {
            // Pedimos solo los últimos 3 posts para la portada
            const response = await fetch('/api/posts?limit=3');
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                postsContainer.innerHTML = result.data
                    .map(
                        (post) => `
                    <article class="card">
                        <div class="card-img">
                            <img src="${post.featuredImage}" alt="${post.title}" loading="lazy" width="400" height="250" />
                        </div>
                        <div class="card-content">
                            <h3>${post.title}</h3>
                            <p>${post.summary}</p>
                            <a href="/post.html?slug=${post.slug}" class="btn btn-sm">Leer Más</a>
                        </div>
                    </article>
                `
                    )
                    .join('');
            } else {
                postsContainer.innerHTML = '<p>No hay noticias disponibles en este momento.</p>';
            }
        } catch (error) {
            console.error('Error al cargar las noticias:', error);
            postsContainer.innerHTML = '<p>No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.</p>';
        }
    };

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
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // --- 3. ANIMACIONES AL HACER SCROLL (Intersection Observer) ---
    // Esta es una forma moderna y eficiente de detectar cuándo un elemento entra en la pantalla.
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Añade clases de animación a los elementos que ahora son visibles
                    entry.target.classList.add('fade-in');
                    // Puedes añadir más clases si quieres diferentes animaciones
                    // entry.target.classList.add('fade-in-left', 'delay-1');
                    observer.unobserve(entry.target); // Dejamos de observar el elemento una vez animado
                }
            });
        },
        {
            threshold: 0.1, // La animación se dispara cuando el 10% del elemento es visible
        }
    );

    // Seleccionamos todos los elementos que queremos animar
    const elementsToAnimate = document.querySelectorAll(
        '.card, .tech-item, .gallery-item, .section-title, .contact-form, #historia img, #competicion img, #futuro img'
    );
    elementsToAnimate.forEach((el) => {
        observer.observe(el);
    });

    // --- 4. VISOR DE IMÁGENES (LIGHTBOX) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentImageIndex = 0;

    // Función para abrir el lightbox
    const openLightbox = (index) => {
        currentImageIndex = index;
        const img = galleryItems[currentImageIndex].querySelector('img');
        const caption = galleryItems[currentImageIndex].querySelector('.gallery-overlay h4');

        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = caption ? caption.innerHTML : img.alt;
    };

    // Función para cerrar el lightbox
    const closeLightbox = () => {
        lightbox.style.display = 'none';
    };

    // Función para navegar a la imagen anterior
    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentImageIndex);
    };

    // Función para navegar a la imagen siguiente
    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        openLightbox(currentImageIndex);
    };

    // Event Listeners para abrir el lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Event Listeners para cerrar y navegar
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => { // Cierra al hacer clic fuera de la imagen
        if (e.target === lightbox) closeLightbox();
    });

    // --- 4. MANEJO DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
            const formMessage = document.getElementById('form-message');

            const submitButton = contactForm.querySelector(
                'button[type="submit"]'
            );
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
                .then((response) => response.json())
                .then((result) => {
                    // Mostramos el mensaje del servidor en la página
                    formMessage.textContent = result.message;

                    if (result.success) {
                        formMessage.className = 'form-success mt-2';
                        contactForm.reset(); // Limpiamos el formulario si todo fue bien
                    } else {
                        formMessage.className = 'form-error mt-2';
                    }
                })
                .catch((error) => {
                    // Ocurrió un error de red (ej: el servidor no está corriendo)
                    console.error('Error al enviar el formulario:', error);
                    formMessage.textContent =
                        'Hubo un problema de conexión. Por favor, inténtalo de nuevo más tarde.';
                    formMessage.className = 'form-error mt-2';
                })
                .finally(() => {
                    // Esto se ejecuta siempre, haya habido éxito o error
                    submitButton.textContent = 'Enviar Mensaje';
                    submitButton.disabled = false;
                });
        });
    }

    // Iniciar la carga de posts al cargar la página
    fetchPosts();
});
