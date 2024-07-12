import passport from "passport";
import passportLocal from "passport-local";
import GithubStrategy from "passport-github2";

import jwt from "passport-jwt";
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const localStrategy = passportLocal.Strategy;

import { usersService } from "../services/index.js"
import { isValidPasswd } from "../utils/encrypt.js";
import { CLIENT_URL, JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config/config.js";

import { ROLES } from "../constants/role.constants.js"

const initializePassport = () => {
  // Signup
  passport.use(
    "signup",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { email } = req.body;
          // Validamos que no exista el email
          const user = await usersService.getUserByEmail(email);
          if (user) {
            req.flash('error', `User already exists: ${email}`);
            return done(null, false);
          }

          // Tiene avatar?
          const file = req.file;
          let avatar = "";
          if (file) {
            avatar = file.filename;
            req.body.avatar = avatar;
          }

          const newUser = await usersService.createUser(req.body);
          if (!newUser) {
            req.flash('error', `we have some issues register this user: ${email}`);
            return res.status(500).json({ message: `we have some issues register this user` });
          }

          return done(null, newUser);
        } catch (error) {
          throw Error(error)
        }
      }
    )
  );

  // Login
  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {

          // validamos que el usuario exista
          const user = await usersService.getUserByEmail(email);
          if (!user) {
            errorLogger.error(`Error: el usuario con email: ${email} no existe`);
            return done(null, false);
          }

          // validamos la contraseña
          const isValid = await isValidPasswd(password, user.password);
          if (!isValid) {
            errorLogger.error(`Error: ${email} passsord incorrecto`);
            return done(null, false)
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${CLIENT_URL}/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {

          // console.log(profile._json);
          const email = profile._json.email;
          const user = await usersService.getUserByEmail(email);

          if (user) {
            // Ya existe en la DB
            done(null, user);
          }
          else {
            // Guardar en la DB
            const fullName = profile._json.name.split(' ');
            const last_name = fullName.pop();
            const first_name = fullName.join(' ');
            const avatar_url = profile._json.avatar_url;
            let addNewUser = {
              first_name,
              last_name,
              email,
              age: 0,
              password: "",
              avatar: avatar_url,
            };
            let newUser = await usersService.createUser(addNewUser);
            done(null, newUser);
          }

        } catch (error) {
          console.log("🚀 ~ error:", error)
          done(error);
        }
      }
    )
  );

  const cookieExtractor = req => {
    let token = null

    if (req && req.cookies) {
      token = req.signedCookies['jwt']
    }
    // console.log("🚀 ~ cookieExtractor ~ token:", token)

    return token
  }

  passport.use(
    'jwt', 
    new JWTStrategy({
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET
    }, 
    async (jwtPayload, done) => {
    try {
      done(null, jwtPayload.user)
    } catch (error) {
      console.log("🚀 ~ initializePassport ~ error:", error)
      done(error)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await usersService.getUserById({ _id: id });
    done(null, user);
  });

};

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}

const checkAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    next();
  } else {
    req.flash('error', `No cuentas con permisos para ver la ruta '${req.originalUrl}'`);
    res.redirect('/');
  }
}

export default initializePassport;