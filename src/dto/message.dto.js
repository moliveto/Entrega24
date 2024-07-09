export default class MessageDTO {
    constructor(message) {
        this.id = message._id || message.id
        this.email = message.email
        this.type = message.type
        this.body = message.body
        this.createdAt = message.createdAt
        this.is_system = message.type == 'system' ? 1 : 0
    }
}