import passport from "passport";
import jwt from "passport-jwt";
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
import userModel from "../models/users.model.js";
import { JWT_SECRET, JWT_RESET_EXPIRE_IN } from "../config/config.js";

//import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import { ROLES } from "../constants/role.constants.js"

function extractJwtFromCookie(req) {
  const cookies = req.cookies;
  if (!cookies || !cookies.token) {
    return null;
  }
  return cookies.token;
}

const initializePassport = () => {
  
  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: extractJwtFromCookie,
        secretOrKey: JWT_SECRET,
      },
      async (payload, done) => {
        //console.log("jwtPayload:", payload);
        const user = payload.user;
        //console.log(user);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        console.log("jwtPayload:", jwtPayload);

        try {
          if (ROLES.includes(jwtPayload.role)) {
            return done(null, jwtPayload);
          }
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });

};

export default initializePassport;