import { usersService } from "../services/index.js"
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_RESET_EXPIRE_IN, CLIENT_URL } from "../config/config.js";
import { transporter } from "../utils/email.js"
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import { validationResult } from 'express-validator';
import UserDTO from "../dto/user.dto.js";

const logon = async (req, res) => {
    const { email, password } = req.body;
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });
    const isValid = await isValidPasswd(password, user.password);
    if (!isValid) return res.status(401).send({ status: "error", error: "Invalid credentials" });
    req.user = user;
    next();
}

const logoutUser = async (req, res) => {
    res.clearCookie('jwt')
        .status(200)
        .json({
            message: 'You have logged out'
        })
}

const loginUser = async (req, res) => {
    const userDto = new UserDTO(req.user);
    const token = jsonwebtoken.sign(JSON.stringify(userDto), JWT_SECRET)

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        signed: true,
        maxAge: 1000 * 60 * 30 // 30 min
    })

    res.status(200).json({ status: "ok", message: "Ingresaste con exito" });
}

const getAllUsers = async (req, res) => {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users })
}

const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsMsg = errors.array().map(err => err.msg).join(', ');
            // console.log("🚀 ~ createUser ~ errorsMsg:", errorsMsg)
            req.flash('error', `Error al crear usuario: ${errorsMsg}`);
            res.status(404).send({ status: "error", error: `Error al crear usuario: ${errorsMsg}` })
        }
        const user = req.body;
        const newUser = await usersService.create(user);
        req.flash('success', `Usuario creado con éxito`);
        res.send({ status: "success", message: "User created", payload: newUser })
    }
    catch (error) {
        req.flash('error', `Error: ${error}`);
        res.status(404).send({ status: "error", error: `Error: ${error}` })
    }
}

const getUser = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" })
    res.send({ status: "success", payload: user })
}

const updateUser = async (req, res) => {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" })
    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", payload: result })
}

const deleteUser = async (req, res) => {
    const userId = req.params.uid;
    const result = await usersService.delete(userId);
    res.send({ status: "success", payload: result })
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    let token = jsonwebtoken.sign(
        user,
        JWT_SECRET,
        { expiresIn: JWT_RESET_EXPIRE_IN });

    const message = {
        to: email,
        subject: 'Reset Account Password Link',
        html: `
        <h3>Por favor, ingresa al link para cambiar tu contraseña</h3>
        <p>${CLIENT_URL}/updatePassword/${token}"</p>
        `,
    };

    await usersService.SetResetLink(user._id, token);

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error al enviar correo:', error);
            req.flash('error', `Error al enviar correo: ${error}`);
            return res.redirect('/forgot');
        } else {
            console.log('Correo enviado correctamente:', info.messageId);
            req.flash('success', `Correo enviado correctamente: ${info.messageId}`);
            return res.redirect('/forgot');
        }
    });
}

const updatePassword = async (req, res) => {
    const resetLink = req.body.token
    const { newPassword } = req.body;
    if (resetLink) {
        jsonwebtoken.verify(resetLink, JWT_SECRET, async function (error, decodedData) {
            if (error) {
                req.flash('error', `El token ha expirado: ${error}`);
                return res.redirect('/forgot');
            }
            const user = await usersService.getUserById(decodedData._id);
            if (!user) {
                req.flash('error', `Usuario no encontrado`);
                return res.redirect('/forgot');
            }
            const pswHashed = await createHashValue(newPassword);
            user.password = await pswHashed;
            user.resetLink = '';
            const result = await usersService.update(user._id, user);
            if (result) {
                req.flash('success', `La contraseña ha sido actualizada`);
                return res.redirect('/');
            }
        });
    }
    else {
        req.flash('error', `Autenticación fallida`);
        return res.redirect('/forgot');
    }
}

const uploadDocumentCtrl = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            req.flash('error', `No se ha cargado ningún archivo`);
            return res.redirect('/profile');
            //return res.status(400).json({ status: "error", message: "No file uploaded" });
        }

        const uid = req.params.uid;
        const filename = file.filename;

        const user = await usersService.getUserById(uid);
        if (!user) {
            req.flash('error', `Usuario no encontrado:`);
            return res.redirect('/profile');
            // return res.status(404).json({ status: "error", message: "User not found" });
        }

        const filePath = `/doc/${filename}`; // Ruta del archivo (ajusta según sea necesario)
        const documentToAdd = {
            name: filename, // o cualquier otro nombre que quieras darle al documento
            reference: filePath, // la ruta de acceso al archivo
        };

        user.documents.push(documentToAdd);

        const uploadResult = await usersService.update(uid, user);

        req.flash('success', `Los documentos fueron cargados exitosamente`);
        return res.redirect('/profile');
        //return res.status(200).json({ status: "ok", message: "File uploaded successfully", data: uploadResult });
    } catch (error) {
        // Manejar cualquier error que ocurra durante la carga
        req.flash('error', `Ha ocurrido un error al cargar los documentos: ${error.message}`);
        return res.redirect('/profile');
        //return res.status(500).json({ status: "error", message: error.message });
    }
};

const togglePremiumCtrl = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await usersService.getUserById(uid);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        if (user.role === "admin") {
            res.status(400).json({ status: "error", message: "No se puede cambiar el rol de un ADMIN" });
        }

        if (user.documents.length === 0) {
            res.status(400).json({ status: "error", message: "debe cargar documentacion para ser PREMIUM" });
        }

        user.role = "premium";
        const updateResult = await usersService.update(uid, user);

        // Si todo sale bien, enviar una respuesta de éxito
        return res.status(200).json({ status: "ok", message: "User toogle premium successfully", data: updateResult });

    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
}

export default {
    loginUser,
    logoutUser,
    deleteUser,
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    forgotPassword,
    updatePassword,
    togglePremiumCtrl,
    uploadDocumentCtrl
}