import passport from "passport";
import passportLocal from "passport-local";
import GithubStrategy from "passport-github2";

import jwt from "passport-jwt";
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const localStrategy = passportLocal.Strategy;

import { usersService } from "../services/index.js"
import { isValidPasswd } from "../utils/encrypt.js";
import { JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config/config.js";

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
        callbackURL: "http://localhost:3000/api/session/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(
          "🚀 ~ file: passport.config.js:17 ~ async ~ profile:",
          profile
        );
        try {
          let user = await userModel.findOne({ email: profile._json?.email });
          if (!user) {
            let addNewUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json?.email,
              age: 0,
              password: "",
            };
            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
          } else {
            // ya existia el usuario
            done(null, user);
          }
        } catch (error) {
          console.log("🚀 ~ file: passport.config.js:39 ~ error:", error);

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

    return token
  }

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: JWT_SECRET
  }, async (jwtPayload, done) => {
    try {
      done(null, jwtPayload)
    } catch (error) {
      done(error)
    }
  }))

  // passport.use(
  //   'current',
  //   new JWTStrategy(
  //     {
  //       jwtFromRequest: extractJwtFromCookie,
  //       secretOrKey: JWT_SECRET,
  //     },
  //     async (payload, done) => {
  //       //console.log("jwtPayload:", payload);
  //       const user = payload.user;
  //       //console.log(user);
  //       if (!user) {
  //         return done(null, false);
  //       }
  //       return done(null, user);
  //     }
  //   )
  // );

  // passport.use(
  //   "jwt",
  //   new JWTStrategy(
  //     {
  //       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  //       secretOrKey: JWT_SECRET,
  //     },
  //     async (jwtPayload, done) => {
  //       console.log("jwtPayload:", jwtPayload);

  //       try {
  //         if (ROLES.includes(jwtPayload.role)) {
  //           return done(null, jwtPayload);
  //         }
  //         return done(null, jwtPayload);
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );

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

// function extractJwtFromCookie(req) {
//   const cookies = req.cookies;
//   if (!cookies || !cookies.token) {
//     return null;
//   }
//   return cookies.token;
// }

export default initializePassport;