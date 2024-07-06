import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_RESET_EXPIRE_IN } from "../config/config.js";

export const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_RESET_EXPIRE_IN }, (err, token) => {
      if (err) {
        console.log(err);
        reject("can not generate jwt token");
      }
      resolve(token);
    });
  });
};