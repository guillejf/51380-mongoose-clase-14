import express from "express";

let usuarios = [
  { id: "100", name: "guille", edad: 40 },
  { id: "101", name: "laura", edad: 20 },
  { id: "102", name: "pepe", edad: 18 },
];

export const usersHtmlRouter = express.Router();
usersHtmlRouter.get("/", (req, res) => {
  return res.status(200).render("usuarios", { usuarios });
});
