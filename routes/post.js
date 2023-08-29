const express = require("express");
const PostController = require("../controllers/post");
const multiparty = require("connect-multiparty");
const middleware_authentication = require("../middlewares/authenticated");
const md_upload = multiparty({ uploadDir: "./uploads/news" });

const api = express.Router();

// Ruta para crear una nueva noticia
api.post(
  "/new-post",
  [middleware_authentication.ensureAuth, md_upload],
  PostController.createNew
);
// Ruta para obtener todas las noticias
api.get("/", PostController.getAllNews);

// Ruta para obtener una noticia específica por su ID
api.get("/:id", PostController.obtenerNoticiaPorId);

// Nueva ruta para obtener los posts asociados con una categoría
api.get(
  "/category/:categoryId",
  PostController.getPostsAssociatedWithCategory
);

// Ruta para actualizar una noticia por su ID
api.patch(
  "/edit/:id",
  [middleware_authentication.ensureAuth],
  PostController.editarNoticia
);

// Ruta para eliminar una noticia por su ID
api.delete(
  "/delete/:id",
  [middleware_authentication.ensureAuth],
  PostController.eliminarNoticia
);

module.exports = api;
