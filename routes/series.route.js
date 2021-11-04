const express = require('express');
const router = express.Router();
const serieSchema = require("../model/serie");

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
function validDocument(serie) {
  if (!serie) {
    return false;
  } else {
    return true;
  }
}

//Função para verificar se todos os campos necessários estão completos
function validBody(serie) {
  if (!serie || !serie.name || !serie.imageURL) {
    return false;
  } else {
    return true;
  }
}

router.get("/", (req, res) => {
  res.send({ info: "Hello MongoDB" });
});

//Retorna a lista com todos os jogos cadastrados
app.get("/series", async (req, res) => {
  const series = await serieSchema.find();
  res.send(series);
});

//GET by id => /livros/:id - retorna um unico livro pelo ID
router.get("/series/:id", async (req, res) => {
  const id = req.params.id;

  //verificação se o id recebido no parâmetro é válido. é válido
  if (!validMongoose(id)) {
    res.status(422).send({ error: "Id inválido." }); //422-Não processável
  }

  //busca no mongodb o document que possui o id recebido pela req.param
  const serie = await serieSchema.findById(id);

  //Verifica se o document foi encontrado.
  if (!validDocument(serie)) {
    res.status(404).send({ error: "Serie não encontrada." }); //404-Não encontrado
  }
  res.send({ serie });
});

//POST - /series - cria um nova serie
router.post("/series", async (req, res) => {
  const serie = req.body;
  if (!serie) {
    res.status(400).send({ error: "Serie inválida." }); //400-Pedido ruim
  }
  const serieSalvo = await new serieSchema(serie).save();
  res.status(201).send({ serieSalvo }); //201-Criado
});

//PUT - /series/:id - Atualiza serie pelo id
router.put("/series/:id", async (req, res) => {
  const id = req.params.id;
  validMongoose(id);
  const serie = await serieSchema.findById(id);
  if (!validDocument(serie)) {
    res.status(404).send({ error: "Serie não encontrada." }); //404-Não encontrado
  }
  const novoSerie = req.body;
  if (!validBody(serie)) {
    res.status(400).send({ error: "Serie inválida." }); //400-Pedido ruim
  };
  await serieSchema.findOneAndUpdate({ _id: id }, novoSerie);
  const serieAtualizado = await serieSchema.findById(id);
  res.send({ serieAtualizado });
});

//delete
router.delete("/series/:id", async (req, res) => {
  const id = req.params.id;
  validMongoose(id);
  const serie = await serieSchema.findById(id);
  if (!validDocument(serie)) {
    res.status(404).send({ error: "Serie não encontrada." }); 
  }
  await serieSchema.findByIdAndDelete(id);
  res.send({ message: "Serie excluída com sucesso!" });
});


module.exports = router;