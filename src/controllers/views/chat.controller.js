import { chatsService } from "../../services/index.js";

const getMessages = async (req, res) => {
    res.render('pages/messagesIO', { notifications: req.flash(), use_chat: 1 });
}

const getMyMessages = async (req, res) => {
    let messages;
    const allMessages = await chatsService.getMyMessages(req.user.email);

    if (allMessages.status === 'error') {
        error = allMessages.message;
        req.flash('error', error);
    } else {
        messages = allMessages.data.map(m => new messageDTO(m));
    }

    res.render('pages/messages', { messages, notifications: req.flash() });
}

const addMessage = async (req, res) => {
    const { body, forEmail } = req.body;
    console.log("🚀 ~ addMessage ~ req.body:", req.body)
    if (req.user) {
        const newMessage = {
            type: req.user.is_admin ? 'system' : 'user',
            email: req.user.is_admin ? forEmail : req.user.email,
            body
        }

        if (!body || !newMessage.email) {
            req.flash('error', `Todos los campos son necesarios para agregar un mensaje.`);
        } else {
            const answer = chatsService.addMessage(newMessage);
            if (answer.status === 'error') {
                req.flash(answer.status, answer.message);
            } else {
                req.flash(answer.status, `Mensaje enviado.`);
            }
        }
    }
    else {
        req.flash('error', `Solo usuarios registrados pueden publicar mensajes.`);
    }

    res.redirect('./chat');
}

export default {
    getMessages,
    getMyMessages,
    addMessage
}