import multer from 'multer';
import path from "path";
import __dirname from "../index.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(`${__dirname}/public/avatar/`));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploaderAvatar = multer({
    storage,
    onError: function (err, next) {
        console.log("🚀 ~ err:", err);
        next();
    },
});

export default uploaderAvatar;