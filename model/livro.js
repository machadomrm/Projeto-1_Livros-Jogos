const mongoose = require("../database/index");

const LivroSchema = new mongoose.Schema({
  nome: {
    type: String,
    require: true,
  },
  duracao: {
    type: Number,
    require: true,
  },
});

const Livro = mongoose.model("Livro", LivroSchema);

module.exports = Livro;