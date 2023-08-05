const express = require("express");
const NoticiaController = require("../controllers/post");
const middleware_authentication = require("../middlewares/authenticated");

const api = express.Router();

// Ruta para crear una nueva noticia
api.post(
  "/new-post",
  middleware_authentication.ensureAuth,
  NoticiaController.crearNoticia
);

// Ruta para obtener todas las noticias
api.get("/", NoticiaController.obtenerTodasNoticias);

// Ruta para obtener una noticia específica por su ID
api.get("/:id", NoticiaController.obtenerNoticiaPorId);

// Ruta para actualizar una noticia por su ID
api.put(
  "/edit/:id",
  middleware_authentication.ensureAuth,
  NoticiaController.editarNoticia
);

// Ruta para eliminar una noticia por su ID
api.delete(
  "/delete/:id",
  middleware_authentication.ensureAuth,
  NoticiaController.eliminarNoticia
);

module.exports = api;
