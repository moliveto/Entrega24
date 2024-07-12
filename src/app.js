import express from 'express';
import session from 'express-session';
import sharedsession from "express-socket.io-session";
import compression from "express-compression";
import { engine, create } from "express-handlebars"
import flash from 'connect-flash';
import { Server as IO } from "socket.io";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from "passport";
import cors from "cors";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import displayRoutes from "express-routemap";
import path from "path"
import { fileURLToPath } from 'url';
import { warnLogger } from './utils/logger.js';

import usersRouter from './routes/users.routes.js';
import productsRouter from './routes/products.routes.js';
import indexRoutes from './routes/view/index.routes.js';

import initializePassport from "./config/pasport.config.js";
import { PORT, PERSISTENCE, MONGO_URI, CLIENT_URL, SESSION_SECRET, SESSION_LIMIT, COOKIE_SECRET } from "./config/config.js";
import { swaggerOpts } from "./config/swagger.config.js";

import moment from 'moment';
moment.locale('es');
import MessageDTO from "./dto/message.dto.js";

const connection = mongoose.connect(MONGO_URI, {});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`dirname: ${__dirname}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
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

// Configuración de express-session
const expressSession = session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  //cookie: { maxAge: SESSION_LIMIT }
});
app.use(expressSession);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Helpers de Handlebars
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

// Configuración de flash
app.use(flash());
// Configuración de handlebars
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

// Compartir la sesión de express con socket.io
io.use(sharedsession(expressSession, {
  autoSave: true
}));


import { chatsService } from "./services/index.js";
let ms = await chatsService.getAll();
let messages = ms.data.map(m => new MessageDTO(m));
io.on('connection', socket => {
  //console.log('Un usuario se ha conectado', socket.id);

  io.sockets.emit('messages', messages);

  socket.on('message', async (msg) => {
    const msgeDB = await chatsService.save(msg);
    const msgDto = new MessageDTO(msgeDB);
    messages.unshift(msgDto);
    io.emit('message', msgDto);
  });

  socket.on('get-my-messages', async (email) => {
    const allMessages = await chatsService.getMyMessages(email);
    const getMyMessages = allMessages.map(m => new MessageDTO(m));
    socket.emit('my-messages', getMyMessages);
  });

  socket.on('get-all-messages', async () => {
    socket.emit('all-messages', messages);
  });

  socket.on("user-login", (usr) => {
    socket.broadcast.emit("new-user", usr);
  });

  socket.on('disconnect', () => {
    //console.log('Un usuario se ha desconectado', socket.id);
  });
});
