import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "dev"}.local` });

const {
    NODE_ENV,
    PORT,
    PERSISTENCE,
    CLIENT_URL,

    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_URI,

    JWT_SECRET,
    JWT_EXPIRE_IN,
    JWT_RESET_EXPIRE_IN,

    GOOGLE_APP_EMAIL,
    GOOGLE_APP_PW,

    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
} = process.env;

if (!NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
}

let MONGO_URI = null;
if (DB_URI) {
    MONGO_URI = DB_URI;
}
else {
    const DB_HOST_ENV = DB_HOST || "localhost";
    const DB_PORT_ENV = DB_PORT || "27017";
    const DB_NAME_ENV = DB_NAME || "entrega23";
    MONGO_URI = `mongodb://${DB_HOST_ENV}:${DB_PORT_ENV}/${DB_NAME_ENV}`;
}

export {
    NODE_ENV,
    PORT,
    PERSISTENCE,
    CLIENT_URL,

    MONGO_URI,

    JWT_SECRET,
    JWT_EXPIRE_IN,
    JWT_RESET_EXPIRE_IN,

    GOOGLE_APP_EMAIL,
    GOOGLE_APP_PW,

    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
};
