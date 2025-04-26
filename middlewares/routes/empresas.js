const express = require("express");
const router = express.Router();

// Buscar todas as empresas
router.get("/", (req, res) => {
  req.db.query("SELECT * FROM empresa", (err, results) => {
    if (err) {
      console.error("Erro ao buscar empresas:", err);
      return res.status(500).send("Erro ao buscar empresas");
    }
    res.send(results);
  });
});

// Buscar uma empresa por ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  req.db.query("SELECT * FROM empresa WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Empresa não encontrada");
    }
  });
});

// Criar nova empresa
router.post("/", (req, res) => {
  const empresa = req.body;
  console.log("Empresa recebida:", empresa);

  req.db.query("INSERT INTO empresa SET ?", empresa, (err, results) => {
    if (err) {
      console.error("Erro ao inserir empresa:", err);
      return res.status(500).send("Erro ao inserir empresa");
    }
    res.status(201).send({ id: results.insertId, ...empresa });
  });
});

// Atualizar empresa por ID
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const empresa = req.body;

  req.db.query("UPDATE empresa SET ? WHERE id = ?", [empresa, id], (err, results) => {
    if (results.affectedRows === 0) {
      return res.status(404).send("Empresa não encontrada");
    }
    res.send("Empresa atualizada com sucesso");
  });
});

// Deletar empresa por ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  req.db.query("DELETE FROM empresa WHERE id = ?", [id], (err, results) => {
    if (results.affectedRows === 0) {
      return res.status(404).send("Empresa não encontrada");
    }
    res.send("Empresa deletada com sucesso");
  });
});

// Pesquisa personalizada por razão social ou CNPJ
router.post("/pesquisar", (req, res) => {
  const { razao_social, cnpj } = req.body;

  const query = `
    SELECT * FROM empresa 
    WHERE razao_social LIKE ? 
    OR cnpj = ?
  `;

  req.db.query(query, [`%${razao_social}%`, cnpj], (err, results) => {
    if (err) {
      console.error("Erro ao buscar empresas:", err);
      return res.status(500).json({ error: "Erro ao buscar empresas" });
    }
    res.json(results);
  });
});

module.exports = router;
