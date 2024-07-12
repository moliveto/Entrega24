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

export const authorizationStrategy = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({
          error: info.messages ? info.messages : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorizationRol = (validRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).send({ error: "No autorizado" });

    if (validRoles.includes(user.user.roles)) {
      next();
    } else {
      res.status(403).send({ error: "Usuario no autorizado" });
    }
  };
};

export const authorizationProduct = async (req, res, next) => {
  const id = req.params.pid;
  const { email, roles } = req.user.user;

  const product = await productService.getProductById(id);

  if (roles === "admin") {
    console.log("Producto eliminado por Administrador");
    return next();
  } else
    if (product.owner === email && roles === "premium") {
      console.log("Producto eliminado por usuario Premium");
      return next();
    } else {
      console.log("No tienes permisos");
      res.status(403).send({ status: "No tienes permisos" });
    }
};

export const authorizationAddToCart = async (req, res, next) => {
  const id = req.params.pid;
  const { email, roles } = req.user.user;

  const product = await productService.getProductById(id);

  if (roles === "premium" && product.owner === email) {
    console.log("User Premium no puede agregar su propio producto al carrito");
    return res
      .status(403)
      .send({ status: "No puedes agregar tu propio producto al carrito." });
  }

  next();
};

export {
  authMdw as handlePolicies,
  productMdwPremium,
}