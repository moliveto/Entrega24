const socket = io();
console.log("contectado");

const chatElement = document.querySelector('#chat');
/*
const counterElement = document.querySelector('#counter');
let count = 15;

var interval = setInterval(function() { 
    if (count > 0) {
        counterElement.textContent = count;
        count--;
    }
    else {
        counterElement.textContent = '... actualizando';
        socket.emit('getMessages', 1);
        //clearInterval(interval);
        count = 15;
    }
}, 1000);
*/

const renderMessages = messages => {
    const html = messages.map((message, index) => {
        const date = new Date(message.createdAt);

        return(
            `
            <div class="message ${message.is_system ? 'message-left' : 'message-right' }">
                <div class="message-avatar ${message.is_system ? '' : 'message-js' }" data-email="${message.email}">
                    <i class="bi bi-person-circle"></i>
                </div>
                <div class="flex-shrink-1 message-body rounded py-2 px-3 mr-3">
                    <div class="fw-semibold mb-1">${message.is_system ? 'Para:' : 'De:' } ${message.email}</div> 
                    ${message.body}
                    <div class="text-muted small text-nowrap mt-2">${date.toLocaleString()}</div>
                </div>
            </div>
            `
        )
    }).join(" ");
    chatElement.innerHTML = html;
}

socket.on('messages', messages => {
    renderMessages(messages);
});