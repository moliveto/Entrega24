import passport from "passport";
import { productsService } from "../services/index.js"

function authMdw(role) {
  return (req, res, next) => {

    if (role.length === 1 && role[0] === "public") {
      return next();
    }

    passport.authenticate("jwt", { session: false }, (err, userJWT, info) => {
      if (err) {
        return next(err)
      }

      if (!userJWT) {
        req.flash('error', `Acceso denegado. Token inválido o expirado.`);
        return res.redirect("/");
      }

      const currentRole = userJWT.role
      if (!role.includes(currentRole)) {
        req.flash('error', `Acceso denegado. Rol no autorizado.`);
        return res.redirect("/");
      }
      req.user = userJWT
      return next()
    })(req, res, next)
  }
}

function productMdwPremium(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (err, userJWT, info) => {
    const currentRole = userJWT.role
    const userId = userJWT._id
    const isUserPremiumAndAdmin = currentRole === 'premium' || currentRole === "admin"
    const product = await productsService.getProductById(req.params.pid);
    const productIsFromOwner = product.owner === userId

    if (err) {
      return next(err)
    }

    if (!userJWT) {
      return res
        .status(401)
        .send({ message: "Acceso denegado. Token inválido o expirado." });
    }

    if (!isUserPremiumAndAdmin) {
      return res
        .status(401)
        .send({ message: "Acceso denegado. No tienes permiso" });
    }

    if (currentRole === 'premium' && !productIsFromOwner) {
      return res
        .status(401)
        .send({ message: "Acceso denegado. Este producto no te pertenece" });
    }

    req.user = userJWT
    return next()
  })(req, res, next)
}

export {
  authMdw as handlePolicies,
  productMdwPremium,
}