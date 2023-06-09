import express from "express";
import { petsRouter } from "./routes/pets.router.js";
import { usersRouter } from "./routes/users.router.js";
import { usersHtmlRouter } from "./routes/users.html.router.js";
import { testSocketChatRouter } from "./routes/test.socket.chat.router.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname, connectMongo } from "./utils.js";
const app = express();
const port = 3000;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
connectMongo();
//mongodb+srv://guillermofergnani:OkOxTsNWTAGM75yw@51380.yhqtnxt.mongodb.net/?retryWrites=true&w=majority

const socketServer = new Server(httpServer);
let msgs = [];

socketServer.on("connection", (socket) => {
  socket.on("msg_front_to_back", (msg) => {
    msg = {
      user: msg.user.replace(
        /<script.*?>|<\/script>|<.*?on.*?=.*?>|<\/.*?>|<.*?>/gi,
        ""
      ),
      msg: msg.msg.replace(
        /<script.*?>|<\/script>|<.*?on.*?=.*?>|<\/.*?>|<.*?>/gi,
        ""
      ),
    };

    msgs.unshift({ msg });
    socketServer.emit("msg_back_to_front", msgs);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

//Rutas: API REST CON JSON
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);

//Rutas: HTML RENDER SERVER SIDE
app.use("/users", usersHtmlRouter);

//Rutas: SOCKETS
app.use("/test-chat", testSocketChatRouter);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "no encontrado",
    data: {},
  });
});
