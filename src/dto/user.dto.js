export default class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.birthday = user.birthday ? user.birthday : null;
        this.address = user.address;
        this.phone = user.phone;
        this.avatar = user.avatar;
        this.role = user.role;
        this.cart = user.cart;
        this.documents = user.documents.map(doc => ({
            name: doc.name,
            reference: doc.reference
        }));
        this.lastConnection = user.last_connection ? user.last_connection : null;
    }
}

// export default class UserDTO {
//     static getUserTokenFrom = (user) => {
//         return {
//             name: `${user.first_name} ${user.last_name}`,
//             role: user.role,
//             email: user.email
//         }
//     }
// }