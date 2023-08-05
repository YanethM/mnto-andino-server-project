const mongoose = require("mongoose");

const SedeSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  nombre_contacto: {
    type: String,
    required: true,
  },
  telefono_contacto: {
    type: String,
  },
  email_contacto: {
    type: String,
  },
  direccion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
});

module.exports = mongoose.model("Sede", SedeSchema);
