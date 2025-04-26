const express = require("express");
const router = express.Router();

// Buscar todos os produtos com categoria e fornecedor
router.get("/", (req, res) => {
  const query = `
    SELECT p.id, p.nome, p.volume, p.codigo_barras, p.marca, 
           c.nome AS categoria_nome, f.nome_fantasia AS fornecedor_nome
    FROM produtos p
    JOIN categoria c ON p.categoria_id = c.id
    JOIN fornecedor f ON p.fornecedor_id = f.id
  `;

  req.db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      res.status(500).send("Erro ao buscar produtos");
    } else {
      res.json(results);
    }
  });
});

// Buscar produto por ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM produtos WHERE id = ?";

  req.db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Produto não encontrado");
    }
  });
});

// Buscar produto por nome
router.get("/nome/:nome", (req, res) => {
  const nome = req.params.nome;
  const query = "SELECT * FROM produtos WHERE nome = ?";

  req.db.query(query, [nome], (err, results) => {
    if (err) {
      console.error("Erro ao buscar produto pelo nome:", err);
      res.status(500).send("Erro ao buscar produto");
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Produto não encontrado");
    }
  });
});

// Inserir novo produto
router.post("/", (req, res) => {
  const produto = req.body;
  const query = "INSERT INTO produtos SET ?";

  req.db.query(query, produto, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ id: results.insertId, ...produto });
    }
  });
});

// Atualizar produto
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const produto = req.body;
  const query = "UPDATE produtos SET ? WHERE id = ?";

  req.db.query(query, [produto, id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Produto atualizado com sucesso");
    }
  });
});

// Deletar produto
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM produtos WHERE id = ?";

  req.db.query(query, [id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Produto deletado com sucesso");
    }
  });
});

module.exports = router;
