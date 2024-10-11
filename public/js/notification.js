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
    }, 5000);
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
    const form = document.getElementById('cadastrarRacaForm');
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
                        'X-Requested-With': 'XMLHttpRequest' // Indica que é uma requisição AJAX
                    }
                });

                // Verifica se a resposta é JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const responseData = await response.json();

                    if (responseData.sucesso) {
                        // O servidor já está emitindo a notificação, então apenas reseta o formulário
                        this.reset();
                    } else {
                        // As notificações de erro são emitidas pelo servidor via Socket.IO
                    }
                } else {
                    // Se não for JSON, recarrega a página (fallback)
                    window.location.reload();
                }
            } catch (error) {
                console.error('Erro ao enviar o formulário:', error);
                showNotification('danger', 'Erro ao enviar o formulário. Por favor, tente novamente.');
            }
        });
    }
});
