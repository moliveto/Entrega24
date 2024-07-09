const socket = io();
let email = '';

document.querySelector('#send-message-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let message = { email: email, message: this.message.value };
    socket.emit('message', message);
    this.message.value = '';
});

socket.on('message', function (msg) {
    let item = document.createElement('li');
    item.textContent = `${msg.email}: ${msg.message}`;
    document.querySelector('#messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("new-user", (data) => {
    Swal.fire({
        text: `¡${data} se a conectado al chat!`,
        toast: true,
        position: "top-right",
        timer: 3000, // 3000 milisegundos = 3 segundos
        showConfirmButton: false
    })
})

window.onload = function () {
    const inputEmail = document.getElementById("email");
    if (!inputEmail) return;
    email = inputEmail.value;
    socket.emit("user-login", email)
};