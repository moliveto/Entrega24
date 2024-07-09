import { chatsService } from "../../services/index.js";
import MessageDTO from "../../dto/message.dto.js";

// const getMessages = async (req, res) => {
//     res.render('pages/messagesIO', { notifications: req.flash(), use_chat: 1 });
// }

const getMessages = async (req, res) => {
    const user = req.user;
    res.render('pages/chat.hbs', { email: user.email, notifications: req.flash(), use_chat: 1 });
}

const getMyMessages = async (req, res) => {
    const user = req.user;
    let messages;
    const allMessages = await chatsService.getMyMessages(user.email);

    if (allMessages.status === 'error') {
        error = allMessages.message;
        req.flash('error', error);
    } else {
        messages = allMessages.map(m => new MessageDTO(m));
    }

    res.render('pages/messages', { messages, notifications: req.flash() });
}

const addMessage = async (req, res) => {
    const user = req.user;
    const is_admin = user.role === 'admin';
    const { body, forEmail } = req.body;
    const newMessage = {
        type: is_admin ? 'system' : 'user',
        email: is_admin ? forEmail : req.user.email,
        body
    }

    if (!body || !newMessage.email) {
        req.flash('error', `Todos los campos son necesarios para agregar un mensaje.`);
    } else {
        const answer = chatsService.save(newMessage);
        if (answer.status === 'error') {
            req.flash(answer.status, answer.message);
        } else {
            req.flash(answer.status, `Mensaje enviado.`);
        }
    }

    res.redirect('./chat');
}

export default {
    getMessages,
    getMyMessages,
    addMessage
}