document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('all-posts-container');
    const paginationControls = document.getElementById('pagination-controls');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    let currentPage = 1;
    let currentSearch = '';

    const fetchAllPosts = async (page = 1, searchQuery = '') => {
        if (!postsContainer) return;

        postsContainer.innerHTML = '<p>Cargando artículos...</p>';
        currentSearch = searchQuery; // Guardamos la búsqueda actual

        try {
            // Llamamos a la API con la página y el término de búsqueda
            const url = `/api/posts?page=${page}&limit=6&search=${encodeURIComponent(searchQuery)}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                renderPosts(result.data);
                renderPagination(result.pagination);
            } else {
                postsContainer.innerHTML = '<p>No hay artículos publicados todavía.</p>';
                paginationControls.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al cargar todos los artículos:', error);
            postsContainer.innerHTML =
                '<p>No se pudieron cargar los artículos. Inténtalo de nuevo más tarde.</p>';
        }
    };

    const renderPosts = (posts) => {
        postsContainer.innerHTML = posts
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
    };

    const renderPagination = (pagination) => {
        currentPage = pagination.currentPage;
        pageInfo.textContent = `Página ${pagination.currentPage} de ${pagination.totalPages}`;

        if (pagination.totalPages > 1) {
            paginationControls.style.display = 'block';
            prevPageBtn.disabled = pagination.currentPage === 1;
            nextPageBtn.disabled = pagination.currentPage === pagination.totalPages;
        } else {
            paginationControls.style.display = 'none';
        }
    };

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchAllPosts(currentPage - 1, currentSearch);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        fetchAllPosts(currentPage + 1, currentSearch);
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        fetchAllPosts(1, searchTerm); // Iniciar búsqueda desde la página 1
    });

    // Cargar la primera página de artículos al iniciar
    fetchAllPosts(1);
});