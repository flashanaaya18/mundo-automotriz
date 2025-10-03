document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const messagesSection = document.getElementById('messages-section');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const messagesList = document.getElementById('messages-list');
    const logoutBtn = document.getElementById('logout-btn');
    const createPostSection = document.getElementById('create-post-section');
    const showCreatePostBtn = document.getElementById('show-create-post-btn');
    const createPostForm = document.getElementById('create-post-form');
    const cancelPostBtn = document.getElementById('cancel-post-btn');
    const createPostMessage = document.getElementById('create-post-message');


    const TOKEN_KEY = 'admin-auth-token';

    // Función para mostrar la sección de mensajes
    const showMessages = () => {
        loginSection.style.display = 'none';
        messagesSection.style.display = 'block';
        createPostSection.style.display = 'none';
        fetchMessages();
    };

    // Función para mostrar la sección de crear post
    const showCreatePost = () => {
        messagesSection.style.display = 'none';
        createPostSection.style.display = 'block';
    };

    // Función para inicializar el editor de texto
    const initTinyMCE = () => {
        tinymce.init({
            selector: 'textarea#post-content',
            plugins: 'lists link image media table code help wordcount',
            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
            skin: 'oxide-dark', // Tema oscuro
            content_css: 'dark' // Contenido del editor en modo oscuro
        });
    };

    const hideCreatePost = () => {
        showMessages();
    };

    // Función para obtener y renderizar los mensajes
    const fetchMessages = async () => {
        const token = sessionStorage.getItem(TOKEN_KEY);
        if (!token) return;

        try {
            const response = await fetch('/api/messages', {
                headers: {
                    'Authorization': `Bearer ${token}` // Añadimos el prefijo "Bearer"
                },
            });

            const result = await response.json();

            if (result.success) {
                renderMessages(result.data);
            } else {
                messagesList.innerHTML = `<p class="form-error">${result.message}</p>`;
            }
        } catch (error) {
            messagesList.innerHTML = `<p class="form-error">Error de conexión al obtener mensajes.</p>`;
        }
    };

    // Función para renderizar los mensajes en una tabla
    const renderMessages = (messages) => {
        if (messages.length === 0) {
            messagesList.innerHTML = '<p>No hay mensajes recibidos.</p>';
            return;
        }

        const table = `
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Asunto</th>
                        <th>Mensaje</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${messages
                        .map(
                            (msg) => `
                        <tr>
                            <td>${new Date(msg.fecha).toLocaleString()}</td>
                            <td>${msg.nombre}</td>
                            <td>${msg.email}</td>
                            <td>${msg.asunto}</td>
                            <td>${msg.mensaje}</td>
                            <td>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${msg._id}">Eliminar</button>
                            </td>
                        </tr>
                    `
                        )
                        .join('')}
                </tbody>
            </table>
        `;
        messagesList.innerHTML = table;

        // Añadir event listeners a los nuevos botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteMessage);
        });
    };

    // Función para manejar la eliminación de un mensaje
    const handleDeleteMessage = async (e) => {
        const messageId = e.target.dataset.id;
        
        // Pedimos confirmación al usuario
        if (!confirm('¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.')) {
            return;
        }

        const token = sessionStorage.getItem(TOKEN_KEY);
        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            alert(result.message); // Notificamos al usuario
            if (result.success) fetchMessages(); // Recargamos la lista de mensajes
        } catch (error) {
            alert('Error de conexión al intentar eliminar el mensaje.');
        }
    };

    // Manejar el formulario de creación de posts
    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        createPostMessage.textContent = '';

        // Obtenemos el contenido del editor TinyMCE
        const content = tinymce.get('post-content').getContent();

        const postData = {
            title: document.getElementById('post-title').value,
            summary: document.getElementById('post-summary').value,
            featuredImage: document.getElementById('post-image').value,
            content: content,
        };

        const token = sessionStorage.getItem(TOKEN_KEY);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();
            createPostMessage.textContent = result.message;

            if (result.success) {
                createPostMessage.className = 'form-success mt-2';
                createPostForm.reset();
                setTimeout(hideCreatePost, 2000); // Volver a la lista de mensajes después de 2 segundos
            } else {
                createPostMessage.className = 'form-error mt-2';
            }
        } catch (error) {
            createPostMessage.textContent = 'Error de conexión al crear el artículo.';
            createPostMessage.className = 'form-error mt-2';
        }
    });


    // Manejar el envío del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        loginMessage.textContent = '';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const result = await response.json();

            if (result.success) {
                // Guardamos el token JWT en la sesión del navegador
                sessionStorage.setItem(TOKEN_KEY, result.token);
                showMessages();
            } else {
                loginMessage.textContent = result.message;
                loginMessage.className = 'form-error mt-2';
            }
        } catch (error) {
            loginMessage.textContent = 'Error de conexión.';
            loginMessage.className = 'form-error mt-2';
        }
    });

    // Manejar el cierre de sesión
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(TOKEN_KEY);
        window.location.reload();
    });

    showCreatePostBtn.addEventListener('click', showCreatePost);
    cancelPostBtn.addEventListener('click', hideCreatePost);
    initTinyMCE(); // Inicializamos el editor al cargar el script

    // Comprobar si ya existe un token al cargar la página
    if (sessionStorage.getItem(TOKEN_KEY)) {
        showMessages();
    }
});
