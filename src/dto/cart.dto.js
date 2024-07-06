export default class CartDTO
{
    constructor (cart){
        this.id = cart._id || cart.id
        this.email = cart.email
        this.delivery_address = cart.delivery_address
        this.products = cart.products
    }
}