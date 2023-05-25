import express from "express";

let usuarios = [
  { id: "100", name: "guille", edad: 40 },
  { id: "101", name: "laura", edad: 20 },
  { id: "102", name: "pepe", edad: 18 },
];

export const usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    msg: "listado de usuarios",
    data: usuarios,
  });
});

usersRouter.post("/", (req, res) => {
  const newUser = req.body;
  newUser.id = (Math.random() * 100000000000).toFixed(0).toString();
  usuarios.push(newUser);
  return res.status(201).json({
    status: "success",
    msg: "usuario creado",
    data: newUser,
  });
});
