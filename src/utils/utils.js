import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { JWT_SECRET, JWT_EXPIRE_IN, JWT_RESET_EXPIRE_IN } from "../config/config.js";
import jwt from "jsonwebtoken";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPass = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
    //return jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN });
    return jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN, issuer: "coderhouse", subject: `${user.email}`, audience: "coderhouse", jwtid: `${user.id}` });
};

