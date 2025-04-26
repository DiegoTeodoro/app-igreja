const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const verifyToken = require("../auth");

// Cadastro de usuário
router.post("/", (req, res) => {
  const usuario = req.body;

  console.log("Dados recebidos para cadastro de usuário:", usuario);

  req.db.query("INSERT INTO usuarios SET ?", usuario, (err, results) => {
    if (err) {
      console.error("Erro ao inserir usuário:", err.message);
      return res.status(500).send("Erro ao inserir usuário");
    }
    res.status(201).send({ id: results.insertId, ...usuario });
  });
});

// Buscar todos os usuários
router.get("/", (req, res) => {
  req.db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err);
      return res.status(500).send("Erro ao buscar usuários");
    }
    res.send(results);
  });
});

// Login de usuário
router.post("/login", (req, res) => {
  const { login, senha } = req.body;
  const query = "SELECT * FROM usuarios WHERE login = ? AND senha = ?";

  req.db.query(query, [login, senha], (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar usuário");
    }

    if (results.length > 0) {
      const usuario = results[0];
      const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login bem-sucedido",
        token,
        usuario: { id: usuario.id, nome: usuario.login, perfil: usuario.perfil },
      });
    } else {
      res.status(401).send("Usuário ou senha inválidos");
    }
  });
});

// Atualizar usuário
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { login, senha, perfil, ativo } = req.body;

  const query = "UPDATE usuarios SET login = ?, senha = ?, perfil = ?, ativo = ? WHERE id = ?";
  req.db.query(query, [login, senha, perfil, ativo, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar usuário:", err.message);
      return res.status(500).send("Erro ao atualizar usuário");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }

    res.status(200).send({ message: "Usuário atualizado com sucesso!" });
  });
});

// Middleware de verificação de administrador
const verifyAdmin = (req, res, next) => {
  if (req.userProfile !== "Administrador") {
    return res.status(403).json({ message: "Acesso negado: Apenas administradores podem acessar" });
  }
  next();
};

// Rota protegida: Cadastro de usuário apenas por administrador
router.post("/admin", verifyToken, verifyAdmin, (req, res) => {
  const usuario = req.body;

  req.db.query("INSERT INTO usuarios SET ?", usuario, (err, results) => {
    if (err) {
      console.error("Erro ao inserir usuário admin:", err);
      return res.status(500).send("Erro ao inserir usuário");
    }
    res.status(201).send({ id: results.insertId, ...usuario });
  });
});

module.exports = router;
