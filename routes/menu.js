const express = require("express");
const MenuController = require("../controllers/menu");
const middleware_authentication = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");
const fs = require("fs");

const uploadDir = "./uploads/menu/icons";

// Verificar si el directorio existe, si no, crearlo
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const md_upload = multiparty({ uploadDir: "./uploads/menu/icons" });
const api = express.Router();

api.post(
  "/new",
  [middleware_authentication.ensureAuth, md_upload],
  MenuController.createMenu
);

api.get("/", MenuController.getMenu);

api.patch(
  "/:id",
  [middleware_authentication.ensureAuth, md_upload],
  MenuController.updateMenu
);

api.delete(
  "/:id",
  [middleware_authentication.ensureAuth],
  MenuController.deleteMenu
);
module.exports = api;
