import { usersService } from "../../services/index.js"
import UsersModel from "../../models/users.model.js"
import { isValidPasswd } from "../../utils/encrypt.js";
import { generateJWT } from "../../utils/jwt.js";
import { validationResult } from 'express-validator';

const login = async (req, res) => {
    var error = req.flash('error');
    return res.render("pages/login.hbs", { hide_navigation: true, error, notifications: req.flash() });
};

const logon = async (req, res) => {
    const { email, password } = req.body;
    const user = await usersService.getUserByEmail(email);
    if (!user) {
        req.flash('error', `User not found: ${email}`);
        return res.redirect("/faillogin");
    }
    const isValid = await isValidPasswd(password, user.password);
    if (!isValid) {
        req.flash('error', `Invalid credentials`);
        return res.redirect("/faillogin");
    }

    const { first_name, last_name, email: emailDb, birthday, role, cart, address, phone, avatar, _id } = user;

    await usersService.updateLastConnection(_id, { last_connection: Date.now() });

    const token = await generateJWT({
        first_name,
        last_name,
        email: emailDb,
        birthday,
        address,
        phone,
        avatar,
        role,
        cart,
        id: _id
    });

    res.cookie('token', token, { httpOnly: true });
    res.redirect("/products");
}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.redirect("/");
}

const failLogin = async (req, res) => {
    const error = req.flash('error');
    return res.render("pages/loginfail.hbs", { error, hide_navigation: true, notifications: req.flash() });
};

const signup = async (req, res) => {
    return res.render("pages/signup.hbs", { hide_navigation: true, notifications: req.flash() });
};

const signon = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("pages/signup.hbs", { errors: errors.array(), notifications: req.flash() });
    }

    const file = req.file;
    let avatar = "";
    if (file) {
        avatar = file.filename;
        req.body.avatar = avatar;
    }

    const { first_name, last_name, email, birthday, address, phone } = req.body;
    try {
        const user = await usersService.getUserByEmail(email);
        if (user) {
            req.flash('error', `User already exists: ${email}`);
            return res.redirect("/failSignup");
        }

        const newUser = await usersService.createUser(req.body);
        if (!newUser) {
            return res.redirect("/failSignup");
        }
        const { role, cart, _id } = newUser;

        const token = await generateJWT({
            first_name,
            last_name,
            email,
            birthday,
            address,
            phone,
            avatar,
            role,
            cart,
            id: _id
        });

        res.cookie('token', token, { httpOnly: true });
        res.redirect("/products");
    } catch (error) {
        console.error("Error during signon process:", error);
        res.redirect("/failSignup");
    }
}

const failSignup = async (req, res) => {
    const error = req.flash('error');
    return res.render("pages/signupfail.hbs", { error, hide_navigation: true, notifications: req.flash() });
};

const forgot = async (req, res) => {
    return res.render("pages/forgot.hbs", { hide_navigation: true, notifications: req.flash() });
};

const updatepassword = async (req, res) => {
    const token = req.params.token
    return res.render("pages/updatePassword.hbs", { hide_navigation: true, token: token, notifications: req.flash() });
};

const profileUser = async (req, res) => {
    const { email } = req.user;
    const user = await usersService.getUserByEmail(email);
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';
    const error = req.flash('error');
    res.render("pages/profile.hbs", { user, error, notifications: req.flash() });
};

const users = async (req, res) => {
    const user = req.user;
    res.locals.email = user.email;
    res.locals.avatar = user.avatar;
    res.locals.is_admin = user.role === 'admin';
    const is_admin = user.role === 'admin';

    const { page = 1, limit = 10, sort, filter } = req.query;
    try {
        const sortTogle = (sort) => {
            let srt = parseInt(sort)
            if (sort === undefined) return 1
            else { return srt *= -1 }
        }

        const sorting = sortTogle(sort)

        const response = await UsersModel.paginate({ filter }, { limit: limit, page: page, sort: { price: sorting } })
        if (page > response.totalPages) {
            req.flash('error', `La pagina seleccionada no existe`);
            res.render("pages/pages/users.hbs", {
                title: "Usuarios",
                notifications: req.flash()
            })
        }

        var maxLength = 10;
        const users = response.docs.map(doc => {
            return {
                id: doc._id,
                first_name: doc.first_name,
                last_name: doc.last_name,
                email: doc.email,
                address: doc.address,
                phone: doc.phone,
                birthday: doc.birthday,
                haveDoc: doc.documents.length > 0,
                last_connection: doc.last_connection,
                avatar: doc.avatar,
                role: doc.role
            }
        });

        res.render("pages/users.hbs", {
            title: "Usuarios",
            users: users,
            page: response.page,
            sort: sorting,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            totalPages: response.totalPages,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            hide_navigation: false,
            is_admin,
            notifications: req.flash()
        })
    } catch (error) {
        req.flash('error', `Hubo un problema: ${error}`);
        res.render("pages/users.hbs", {
            title: "Usuarios",
            notifications: req.flash()
        })
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("pages/users.hbs", { errors: errors.array(), notifications: req.flash() });
    }

    const { email } = req.body;
    try {
        const user = await usersService.getUserByEmail(email);
        if (user) {
            req.flash('error', `User already exists: ${email}`);
            return res.redirect("/users");
        }

        const newUser = await usersService.createUser(req.body);
        if (!newUser) {
            return res.redirect("/users");
        }

        res.redirect("/users");
    } catch (error) {
        req.flash('error', `Hubo un problema: ${error}`);
        return res.redirect("/users");
    }
}

const getUserById = async (req, res) => {
    const userId = req.params.id;
    const user = await usersService.getUserById(userId);
    if (!user) {
        req.flash('error', `User not found: ${userId}`);
        return res.redirect("/users");
    }
    res.render("pages/updateUser.hbs", { user, notifications: req.flash() });
}

const updateUser = async (req, res) => {
    try {
        const updateBody = req.body;
        const userId = req.body.id;
        const user = await usersService.getUserById(userId);
        if (!user) {
            req.flash('error', `User not found: ${userId}`);
            return res.redirect("/users");
        }
        const result = await usersService.update(userId, updateBody);
        res.redirect("/users");
    } catch (error) {
        req.flash('error', `Hubo un problema: ${error}`);
        return res.redirect("/users");
    }
}

const deleteUser = async (req, res) => {
    const userId = req.body.id;
    const result = await usersService.delete(userId);
    if (!result) {
        req.flash('error', `User not found: ${userId}`);
        return res.redirect("/users");
    }
    res.redirect("/users");
}

export default {
    login,
    logon,
    logout,
    failLogin,
    signup,
    failSignup,
    signon,
    forgot,
    updatepassword,
    profileUser,
    users,
    createUser,
    getUserById,
    updateUser,
    deleteUser
}