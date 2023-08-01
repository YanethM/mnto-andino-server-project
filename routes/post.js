const express = require("express");
const NoticiaController = require("../controllers/noticia");
const middleware_authentication = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({ uploadDir: "./uploads/noticias" });
const api = express.Router();

// Ruta para crear una nueva noticia
api.post(
  "/new-post",
  [middleware_authentication.ensureAuth, md_upload],
  NoticiaController.crearNoticia
);

// Ruta para obtener todas las noticias
api.get("/", NoticiaController.obtenerTodasNoticias);

// Ruta para obtener una noticia específica por su ID
api.get("/:idPost", NoticiaController.obtenerNoticiaPorId);

// Ruta para actualizar una noticia por su ID
api.put(
  "/edit/:idPost",
  [middleware_authentication.ensureAuth, md_upload],
  NoticiaController.editarNoticia
);

// Ruta para eliminar una noticia por su ID
api.delete(
  "/delete/:idPost",
  middleware_authentication.ensureAuth,
  NoticiaController.eliminarNoticia
);

module.exports = api;
