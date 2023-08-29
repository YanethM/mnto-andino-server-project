const express = require("express");
const SedeController = require("../controllers/sede");

const api = express.Router();


api.post("/sede", SedeController.createSede);
api.get("/", SedeController.getAllSedes);
api.get("/:parametro", SedeController.filterSedes);
api.get("/buscar/:nombre/:departamento/:municipio", SedeController.searchSedes); // Agrega la ruta para searchSedes
api.patch("/:id", SedeController.updateSede);
api.delete("/:id", SedeController.deleteSede);
api.get("/municipio/:parametro", SedeController.filterSedesPerMunicipio);

module.exports = api;
