const express = require("express");
const CategoryController = require("../controllers/category");
const multiparty = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");

const md_upload = multiparty({ uploadDir: "./uploads/categories" });
const api = express.Router();

// Ruta para crear una nueva categoría
api.post(
  "/new-category",
  [md_auth.ensureAuth, md_upload],
  CategoryController.crearCategoria
);

// Ruta para obtener todas las categorías
api.get("/", CategoryController.obtenerTodasCategorias);

// Ruta para obtener una categoría específica por su ID
api.get("/:idCategory",CategoryController.obtenerCategoriaPorId);

// Ruta para actualizar una categoría por su ID
api.put(
  "/edit/:idCategory",
  [md_auth.ensureAuth, md_upload],
  CategoryController.editarCategoria
);

// Ruta para eliminar una categoría por su ID
api.delete(
  "/delete/:idCategory",
  md_auth.ensureAuth,
  CategoryController.eliminarCategoria
);

module.exports = api;
