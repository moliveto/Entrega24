import multer from 'multer';
import path from "path";
import __dirname from "../index.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(`${__dirname}/public/doc/`));
    },
    filename: function (req, file, cb) {
        //console.log("🚀 ~ file:", file);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploader = multer({
    storage,
    onError: function (err, next) {
        console.log("🚀 ~ err:", err);
        next();
    },
});

export default uploader;