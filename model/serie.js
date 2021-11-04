const mongoose = require("../database/index");

const SerieSchema = new mongoose.Schema({
  nome: {
    type: String,
    require: true,
  },
  duracao: {
    type: Number,
    require: true,
  },
});

const Serie = mongoose.model("Serie", SerieSchema);

module.exports = Serie;