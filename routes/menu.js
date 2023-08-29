const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/menu", [md_auth.ensureAuth], MenuController.createMenu);
api.get("/", MenuController.getMenus);
api.patch("/menu/:id", [md_auth.ensureAuth], MenuController.updateMenu);
api.delete("/menu/:id", [md_auth.ensureAuth], MenuController.deleteMenu);

module.exports = api;