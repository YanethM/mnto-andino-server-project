const express = require("express");
const ClientController = require("../controllers/client");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

// Ruta para crear una nueva categoría
api.post("/new-client", [md_auth.ensureAuth], ClientController.createClient);

// Ruta para obtener todas las categorías
api.get("/", ClientController.getAllClients);

// Ruta para obtener una categoría específica por su ID
api.get("/:idClient", ClientController.getClientById);

// Ruta para actualizar una categoría por su ID
api.patch(
  "/edit/:idClient",
  [md_auth.ensureAuth],
  ClientController.updateClientById
);

// Ruta para eliminar una categoría por su ID
api.delete(
  "/delete/:idClient",
  md_auth.ensureAuth,
  ClientController.deleteClientById
);

module.exports = api;
