import { body } from 'express-validator';

export const ValidateSignup = () => {
    return [
        body('first_name', 'Introduce tu nombre').not().isEmpty().trim(),
        body('last_name', 'Introduce tu apellido').not().isEmpty().trim(),
        body('email').isEmail().withMessage('Email is not valid').normalizeEmail(),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        body('phone', 'Introduce tu teléfono').not().isEmpty().trim().isLength({ min: 10 }).withMessage('El teléfono debe contener al menos 10 dígitos, ejemplo: +123...'),
        body('address', 'Introduce una direccion para el envio de mercancia').not().isEmpty().trim(),
        body('birthday', 'Introduce tu fecha de nacimiento').not().isEmpty().trim().isDate().withMessage('Escribe tu fecha de nacimiento en formato dd/mm/yyyy'),
    ];
}

export const validateProduct = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 1, max: 100 }).withMessage('El nombre debe tener entre 1 y 100 caracteres')
            .escape(),
        body('description')
            .trim()
            .isLength({ min: 1, max: 500 }).withMessage('La descripción debe tener entre 1 y 500 caracteres')
            .escape(),
        body('price')
            .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
            .toFloat(),
        body('stock')
            .isInt({ min: 0 }).withMessage('Stock debe ser un número entero positivo')
            .toInt(),
        body('thumbnail')
            .optional({ checkFalsy: true })
            .isURL().withMessage('La miniatura debe ser una URL válida')
            .trim(),
    ];
}