const express = require("express");
const serviceController = require("../controllers/service");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({ uploadDir: "./uploads/services" });
const router = express.Router();

router.post(
  "/new-service",
  [md_auth.ensureAuth, md_upload], // Ensure authentication and use md_upload
  serviceController.createService
);
router.get("/", serviceController.getServices);
router.get("/:id", serviceController.getServiceById);
router.patch("/edit/:id", [md_auth.ensureAuth, md_upload], serviceController.updateService);
router.delete(
  "/delete/:id",
  [md_auth.ensureAuth],
  serviceController.deleteService
);

module.exports = router;
