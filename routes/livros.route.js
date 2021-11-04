const express = require('express');
const router = express.Router();
const livroSchema = require("../model/livro");

const app = express();
const port = 3000;
router.use(express.json());

//Função para verificação se o id recebido no parâmetro é válido. é válido
function validMongoose(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  } else {
    return true;
  }
}

//Função para verificar se o document foi encontrado.
function validDocument(livro) {
  if (!livro) {
    return false;
  } else {
    return true;
  }
}

//Função para verificar se todos os campos necessários estão completos
function validBody(livro) {
  if (!livro || !livro.name || !livro.imageURL) {
    return false;
  } else {
    return true;
  }
}

router.get("/", (req, res) => {
  res.send({ info: "Hello MongoDB" });
});

//Retorna a lista com todos os jogos cadastrados
app.get("/livros", async (req, res) => {
  const livros = await livroSchema.find();
  res.send(livros);
});

//GET by id => /livros/:id - retorna um unico livro pelo ID
router.get("/livros/:id", async (req, res) => {
  const id = req.params.id;

  //verificação se o id recebido no parâmetro é válido. é válido
  if (!validMongoose(id)) {
    res.status(422).send({ error: "Id inválido." }); //422-Não processável
  }

  //busca no mongodb o document que possui o id recebido pela req.param
  const livro = await livroSchema.findById(id);

  //Verifica se o document foi encontrado.
  if (!validDocument(livro)) {
    res.status(404).send({ error: "Livro não encontrado." }); //404-Não encontrado
  }
  res.send({ livro });
});

//POST - /livros - cria um novo livro
router.post("/livros", async (req, res) => {
  const livro = req.body;
  if (!livro) {
    res.status(400).send({ error: "Livro inválido." }); //400-Pedido ruim
  }
  const livroSalvo = await new livroSchema(livro).save();
  res.status(201).send({ livroSalvo }); //201-Criado
});

//PUT - /livros/:id - Atualiza um jogo pelo id
router.put("/livros/:id", async (req, res) => {
  const id = req.params.id;
  validMongoose(id);
  const livro = await livroSchema.findById(id);
  if (!validDocument(livro)) {
    res.status(404).send({ error: "Livro não encontrado." }); //404-Não encontrado
  }
  const novoLivro = req.body;
  if (!validBody(livro)) {
    res.status(400).send({ error: "Livro inválido." }); //400-Pedido ruim
  };
  await livroSchema.findOneAndUpdate({ _id: id }, novoLivro);
  const livroAtualizado = await livroSchema.findById(id);
  res.send({ livroAtualizado });
});

//delete
router.delete("/livros/:id", async (req, res) => {
  const id = req.params.id;
  validMongoose(id);
  const livro = await livroSchema.findById(id);
  if (!validDocument(livro)) {
    res.status(404).send({ error: "Livro não encontrado." }); 
  }
  await livroSchema.findByIdAndDelete(id);
  res.send({ message: "Livro excluído com sucesso!" });
});


module.exports = router;