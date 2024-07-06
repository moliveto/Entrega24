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

    JWT_SECRET,
    JWT_EXPIRE_IN,
    JWT_RESET_EXPIRE_IN,

    GOOGLE_APP_EMAIL,
    GOOGLE_APP_PW,

    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
} = process.env;

const MONGO_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

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
