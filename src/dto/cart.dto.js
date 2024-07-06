import { ProductDTO } from './product.dto.js'

export default class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id;
        this.email = cart.email;
        this.delivery_address = cart.delivery_address;
        this.products = cart.products.map(p => {
            const dto = new ProductDTO(p.product, p.quantity);
            return dto;
        });
    }
}