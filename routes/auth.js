const express = require("express");
const AuthController = require("../controllers/auth");

const api = express.Router();


api.post("/register", AuthController.register);
api.post("/login", AuthController.login);
api.post("/change-password", AuthController.changePassword);
api.post("/password-recovery", AuthController.passwordRecovery);
api.post("/refresh-access-token", AuthController.refreshAccessToken);

module.exports = api;
