const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");
const app = express();

/* Cargar rutas */
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const sedeRoutes = require("./routes/sede");
const addressRoutes = require("./routes/address");
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");
const menuRoutes = require("./routes/menu");
const serviceRoutes = require("./routes/service");
const clientRoutes = require("./routes/client");

// Configure Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure static folder
app.use(express.static("uploads"));
app.use('/uploads', express.static('uploads'));


// Configurar encabezados CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Cambia esto a tu URL de la aplicación cliente
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  ); // Agrega los métodos permitidos
  next();
});

// Configure Header HTTP - CORS
app.use(cors());

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}/addresses`, addressRoutes);
app.use(`/api/${API_VERSION}/sedes`, sedeRoutes);
app.use(`/api/${API_VERSION}/admin/posts`, postRoutes);
app.use(`/api/${API_VERSION}/admin/categories`, categoryRoutes);
app.use(`/api/${API_VERSION}/admin/menus`, menuRoutes);
app.use(`/api/${API_VERSION}/admin/services`, serviceRoutes);
app.use(`/api/${API_VERSION}/admin/clients`, clientRoutes);

module.exports = app;
