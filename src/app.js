import express from 'express';
import { Server as IO } from "socket.io";
import compression from "express-compression";
import { engine, create } from "express-handlebars"
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import passport from "passport";
import cors from "cors";
import displayRoutes from "express-routemap";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from "path"
import { fileURLToPath } from 'url';
import { warnLogger } from './utils/logger.js';

import usersRouter from './routes/users.routes.js';
import productsRouter from './routes/products.routes.js';
import indexRoutes from './routes/view/index.routes.js';

import initializePassport from "./config/pasport.config.js";
import { PORT, PERSISTENCE, MONGO_URI, CLIENT_URL } from "./config/config.js";
import { swaggerOpts } from "./config/swagger.config.js";

import moment from 'moment';
moment.locale('es');

const connection = mongoose.connect(MONGO_URI, {});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`dirname: ${__dirname}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `${CLIENT_URL}`,
    // origin: "*",
    methods: ["GET", "PUT", "DELETE", "POST"],
  })
);
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

const specs = swaggerJsDoc(swaggerOpts);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

initializePassport();
app.use(passport.initialize());

const hbs = create({});
hbs.handlebars.registerHelper('timeFormat', function (timeFormat, value) {
  return moment(value).format(timeFormat).trim();
})
hbs.handlebars.registerHelper('dateFormat', function (timeFormat, value) {
  return moment(value).format(timeFormat).trim();
})
hbs.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.handlebars.registerHelper('or', function (a, b) {
  return a || b;
});
hbs.handlebars.registerHelper('not', function (a) {
  return !a;
});

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(express.static(`${__dirname}/public`));
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: `${__dirname}/views/layouts`,
  partialsDir: `${__dirname}/views/partials`
}));
app.set('views', path.join(`${__dirname}/views`));
app.set('view engine', 'hbs');
app.use("/", indexRoutes);

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

app.use('*', (req, res) => {
  warnLogger.warn(`Route: ${req.originalUrl} Method: ${req.method} Error: Ruta no implementada`);
  res.render('pages/404', { error: `ruta '${req.originalUrl}' método '${req.method}' no implementada` });
  //res.send({ error: -2, descripcion: `ruta '${req.originalUrl}' método '${req.method}' no implementada` });
});

const httpServer = app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Listening on ${PORT}, enviroment: ${process.env.NODE_ENV} persistence: ${PERSISTENCE}`);
});
httpServer.on('error', () => console.log(`Error: ${err}`));

// Socket
const io = new IO(httpServer);
const messages = [];
io.on('connection', socket => {
  console.log('Un usuario se ha conectado', socket.id);

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado', socket.id);
  });

  socket.on("user-login", (usr) => {
    socket.broadcast.emit("new-user", usr)
  });
});
