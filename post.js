document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById('post-container');

    const getPost = async () => {
        // Obtenemos el 'slug' de la URL
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

        if (!slug) {
            postContainer.innerHTML = '<h1>Artículo no especificado.</h1>';
            return;
        }

        try {
            const response = await fetch(`/api/posts?slug=${slug}`);
            const result = await response.json();

            if (result.success) {
                const post = result.data;
                // Actualizamos el título de la página
                document.title = post.title;

                // Renderizamos el contenido del post
                postContainer.innerHTML = `
                    <header class="post-header container">
                        <h1>${post.title}</h1>
                        <p class="post-meta">
                            Publicado por ${post.author} el ${new Date(
                    post.createdAt
                ).toLocaleDateString()}
                        </p>
                    </header>
                    <section class="post-content-container">
                        <div class="post-content container">
                            <img src="${post.featuredImage}" alt="${post.title}" />
                            <div>${post.content}</div>
                        </div>
                    </section>
                `;
            } else {
                postContainer.innerHTML = `<h1>Error: ${result.message}</h1>`;
            }
        } catch (error) {
            postContainer.innerHTML = '<h1>Error de conexión.</h1>';
        }
    };

    getPost();
});