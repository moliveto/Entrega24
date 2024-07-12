const socket = io();
let emailInput = document.getElementById("email");
let forEmailInput = document.getElementById('forEmail');
let roleInput = document.getElementById("role");
let bodyInput = document.getElementById("body");
let is_admin = false;

const chatElement = document.querySelector('#chat');

function createMessageElement(message) {
    const date = new Date(message.createdAt);
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.is_system ? 'message-left' : 'message-right'}`;
    messageElement.innerHTML = `
        <div class="message-avatar ${message.is_system ? '' : 'message-js'}" data-email="${message.email}">
            <i class="bi bi-person-circle"></i>
        </div>
        <div class="flex-shrink-1 message-body rounded py-2 px-3 mr-3">
            <div class="fw-semibold mb-1">${message.is_system ? 'Para:' : 'De:'} ${message.email}</div> 
            ${message.body}
            <div class="text-muted small text-nowrap mt-2">${date.toLocaleString()}</div>
        </div>
    `;

    if (forEmailInput) {
        messageElement.addEventListener('click', function (event) {
            forEmailInput.value = message.email;
        });
    }

    return messageElement;
}

const renderMessages = messages => {
    chatElement.innerHTML = '';
    messages.forEach(message => {
        renderMessage(message);
    });
}

const renderMessage = message => {
    const messageElement = createMessageElement(message);
    chatElement.appendChild(messageElement);
}

socket.on('messages', messages => {
    renderMessages(messages);
});

socket.on('all-messages', (messages) => {
    renderMessages(messages);
});

socket.on('message', function (message) {
    renderMessage(message);
});

socket.on('my-messages', messages => {
    renderMessages(messages);
});

document.querySelector('#send-message-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const body = bodyInput.value;
    if (!body) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Debes escribir un mensaje!',
        });
        return;
    }
    let email = emailInput.value;
    if (is_admin) {
        email = forEmailInput.value;
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '¡Debes seleccionar un destinatario!',
            });
            return;
        }
    }

    const newMessage = {
        type: is_admin ? 'system' : 'user',
        email,
        body: bodyInput.value
    }

    socket.emit('message', newMessage);
    bodyInput.value = '';
});

socket.on("new-user", (data) => {
    console.log("🚀 ~ socket.on ~ data:", data)
    Swal.fire({
        text: `¡${data} se a conectado al chat!`,
        toast: true,
        position: "top-right",
        timer: 5000
    });
})

window.onload = function () {
    if (!emailInput) return;
    const email = emailInput.value;
    socket.emit("user-login", email);

    is_admin = roleInput.value === 'admin';

    if (is_admin) return;
    document.getElementById('mismensajes').addEventListener('click', function (e) {
        e.preventDefault();

        // Referencia al botón
        const btn = document.getElementById('mismensajes');
        // Comprobar el texto actual del botón y cambiarlo
        if (btn.textContent === "Mis mensajes") {
            btn.textContent = "Todos los mensajes"; // Cambiar el texto del botón
            socket.emit('get-my-messages', email); // Emitir evento para obtener mis mensajes
        } else {
            btn.textContent = "Mis mensajes"; // Cambiar el texto del botón de vuelta
            socket.emit('get-all-messages'); // Emitir evento para obtener todos los mensajes
        }
    });

};