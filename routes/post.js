const express = require("express");
const PostController = require("../controllers/post");
const multiparty = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");

const md_upload = multiparty({ uploadDir: "./uploads/news" });
const api = express.Router();
// Ruta para crear una nueva noticia
api.post(
  "/new-post",
  [md_auth.ensureAuth, md_upload],
  PostController.createNew
);
// Ruta para obtener todas las noticias
api.get("/", PostController.getAllNews);

// Ruta para obtener una noticia específica por su ID
api.get("/:id", PostController.obtenerNoticiaPorId);

// Nueva ruta para obtener los posts asociados con una categoría
api.get("/category/:categoryId", PostController.getPostsAssociatedWithCategory);

// Ruta para actualizar una noticia por su ID
api.patch(
  "/edit/:id",
  [md_auth.ensureAuth],
  PostController.editarNoticia
);

// Ruta para eliminar una noticia por su ID
api.delete(
  "/delete/:id",
  [md_auth.ensureAuth],
  PostController.eliminarNoticia
);

module.exports = api;
