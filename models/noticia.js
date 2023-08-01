const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const NoticiaSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  subtitulo: {
    type: String,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagenes: [
    {
      url: {
        type: String,
        required: true,
      },
      descripcion: {
        type: String,
      },
    },
  ],
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
  },
});

NoticiaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Noticia", NoticiaSchema);
