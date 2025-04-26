const express = require("express");
const router = express.Router();

// Listar todas as categorias
router.get("/", (req, res) => {
  req.db.query("SELECT * FROM categoria", (err, results) => {
    if (err) {
      console.error("Erro ao buscar categorias:", err);
      return res.status(500).send("Erro ao buscar categorias");
    }
    res.send(results);
  });
});

// Buscar categoria por ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  req.db.query("SELECT * FROM categoria WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar categoria:", err);
      return res.status(500).send("Erro ao buscar categoria");
    }
    if (results.length > 0) {
      res.send(results[0]);
    } else {
      res.status(404).send("Categoria não encontrada");
    }
  });
});

// Criar nova categoria
router.post("/", (req, res) => {
  const categoria = req.body;
  req.db.query("INSERT INTO categoria SET ?", categoria, (err, results) => {
    if (err) {
      console.error("Erro ao inserir categoria:", err);
      return res.status(500).send("Erro ao inserir categoria");
    }
    res.send(results);
  });
});

// Atualizar categoria
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const categoria = req.body;
  req.db.query("UPDATE categoria SET ? WHERE id = ?", [categoria, id], (err, results) => {
    if (err) {
      console.error("Erro ao atualizar categoria:", err);
      return res.status(500).send("Erro ao atualizar categoria");
    }
    res.send(results);
  });
});

// Deletar categoria
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  req.db.query("DELETE FROM categoria WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar categoria:", err);
      return res.status(500).send("Erro ao deletar categoria");
    }
    res.send(results);
  });
});

module.exports = router;
