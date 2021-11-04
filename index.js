const express = require("express");
const app = express();

app.use(express.json()); 

const port = 3000; 

const livrosRouter = require("./routes/livros.route");
app.use('/livros',livrosRouter);

app.listen(port, () => {
    console.log("Servidor rodando em: http://localhost:${port}");
});