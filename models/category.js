const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const CategorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  active: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now },
});

CategorySchema.plugin(mongoosePaginate);
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
