const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const { SECRET_KEY } = require('./config'); // Importando a chave secreta
const verifyToken = require('./middlewares/auth'); // Ajuste o caminho conforme necessário
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "igreja_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar com MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL.");
});

// Disponibiliza conexão para os middlewares
app.use((req, res, next) => {
  req.db = connection;
  next();
});

try {
// Importa rotas organizadas
app.use("/api/setores", require("./middlewares/routes/setor"));
app.use("/api/igrejas", require("./middlewares/routes/igrejas"));
app.use("/api/estados", require("./middlewares/routes/estados"));
app.use("/api/cidades", require("./middlewares/routes/cidades"));
app.use("/api/produtos", require("./middlewares/routes/produtos"));
app.use("/api/fornecedores", require("./middlewares/routes/fornecedores"));
app.use("/api/categorias", require("./middlewares/routes/categorias"));
app.use("/api/saldo-estoque", require("./middlewares/routes/saldo-estoque"));
app.use("/api/notas-fiscais", require("./middlewares/routes/notas-fiscais"));
app.use("/api/itens-nota-fiscal", require("./middlewares/routes/itens-nota-fiscal"));
app.use("/api/pedidos", require("./middlewares/routes/pedidos"));
app.use("/api/pedido-itens", require("./middlewares/routes/pedido-itens"));
app.use("/api/empresas", require("./middlewares/routes/empresas"));
app.use("/api/usuarios", require("./middlewares/routes/usuarios"));
app.use("/api/pedido-compra", require("./middlewares/routes/pedido-compra"));
app.use("/api/inventarios", require("./middlewares/routes/inventarios"));
app.use("/api/relatorio-inventario", require("./middlewares/routes/relatorio-inventario"));

} catch (err) {
  console.error("Erro ao registrar rota:", err);
}



// Bloquear arquivos específicos
app.get(["/config.js", "/server.js"], (req, res) => {
  res.status(404).send("Arquivo não permitido.");
});


const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Porta ${port} já está em uso.`);
  } else {
    throw err;
  }
});
