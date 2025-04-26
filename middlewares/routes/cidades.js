const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.db.query("SELECT * FROM cidades", (err, results) => {
    if (err) {
      console.error("Erro ao buscar cidades:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("Cidades obtidas do banco de dados:", results);
    res.send(results);
  });
});

router.post("/", (req, res) => {
  const cidade = req.body;
  req.db.query("INSERT INTO cidades SET ?", cidade, (err, results) => {
    if (err) {
      console.error("Erro ao inserir cidade:", err);
      res.status(500).send("Erro ao inserir cidade");
      return;
    }
    res.send(results);
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const cidade = req.body;
  req.db.query("UPDATE cidades SET ? WHERE id = ?", [cidade, id], (err, results) => {
    if (err) {
      console.error("Erro ao atualizar cidade:", err);
      res.status(500).send("Erro ao atualizar cidade");
      return;
    }
    res.send(results);
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  req.db.query("DELETE FROM cidades WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar cidade:", err);
      res.status(500).send("Erro ao deletar cidade");
      return;
    }
    res.send(results);
  });
});

module.exports = router;
