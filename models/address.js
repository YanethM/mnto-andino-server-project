const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  departamento: {
    type: String,
    required: true,
  },
  municipio: {
    type: String,
    required: true,
  },
  selectedStreet: {
    type: String,
    required: true,
  },
  numero1: {
    type: String,
    required: true,
  },
  numero2: {
    type: String,
  },
  numero3: {
    type: String,
  },
  selectedLetter1: {
    type: String,
  },
  selectedLetter2: {
    type: String,
  },
  selectedLetter3: {
    type: String,
  },
  selectedZone: {
    type: String,
  },
  barrio: {
    type: String,
  },
  complementoDireccion: {
    type: String,
  },
  nombreEdificio: {
    type: String,
  },
  caracteristicasAdicionales: {
    type: String,
  },
  numeroLocal: {
    type: String,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
