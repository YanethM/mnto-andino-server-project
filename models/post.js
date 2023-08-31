const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const PostSchema = mongoose.Schema({
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
  creador: {
    type: String,
    required: true,
  },
  avatar:
    {
      type: String, // Guardaremos la URL de la imagen en la base de datos
    },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  categorias: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", PostSchema);
