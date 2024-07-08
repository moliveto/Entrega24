export default function userAuthAndSetup(req, res, next) {
    const user = req.user;
    if (user) {
        res.locals.email = user.email;
        res.locals.avatar = user.avatar;
        res.locals.is_admin = user.role === 'admin';
    }
    next();
}

// export default {
//     userAuthAndSetup
// }