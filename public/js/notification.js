// public/js/notification.js

// Função para criar e exibir notificações
function showNotification(type, message) {
    const notificationContainer = document.getElementById('notificationContainer');

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    notificationContainer.appendChild(notification);

    // Remover a notificação após 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(notification);
        bsAlert.close();
    }, 10000);
}

// Conectar ao Socket.IO
const socket = io();

// Ouvir eventos de notificação
socket.on('notification', (data) => {
    const { message, type } = data;
    showNotification(type, message);
});

// Manipulador de envio de formulário via AJAX
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });

            try {
                const response = await fetch(this.action, {
                    method: this.method,
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                // Verifica se a resposta é JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const responseData = await response.json();

                    if (responseData.sucesso) {
                        // A notificação será disparada pelo Socket.IO no backend, então apenas reseta o formulário
                        this.reset();
                    } else {
                        // A notificação de erro já é tratada pelo servidor via Socket.IO
                    }
                } else {
                    window.location.reload(); // Recarregar a página se não for JSON
                }
            } catch (error) {
                console.error('Erro ao enviar o formulário:', error);
                showNotification('danger', 'Erro ao enviar o formulário. Por favor, tente novamente.');
            }
        });
    }
});

// Pega a URL atual sem a barra no final, se existir
const currentPath = window.location.pathname.replace(/\/$/, "");

// Seleciona todos os links da sidebar
const links = document.querySelectorAll('.sidebar a');

// Percorre cada link e verifica se a URL é a atual
links.forEach(link => {
    // Remove a barra final do href para comparação
    const linkPath = link.getAttribute('href').replace(/\/$/, "");

    if (linkPath === currentPath) {
        link.classList.add('active'); // Adiciona a classe 'active' ao link correspondente
    }
});


