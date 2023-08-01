const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const CategorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  foto: String,
  active: Boolean,
  created_at: { type: Date, default: Date.now },
});

CategorySchema.plugin(mongoosePaginate);
const Category = mongoose.model("Categoria", CategorySchema);
module.exports = Category;
