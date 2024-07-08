export default function userAuthAndSetup(req, res, next) {
    const user = req.user;
    if (user) {
        res.locals.email = user.email;
        res.locals.avatar = user.avatar;
        res.locals.is_admin = user.role === 'admin';
    }
    else
    {
        res.locals.email = null;
        res.locals.avatar = 'default-user.png';
        res.locals.is_admin = false;
    }
    next();
}