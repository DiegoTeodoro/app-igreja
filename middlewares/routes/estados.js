const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.db.query("SELECT * FROM estados", (err, results) => {
    if (err) {
      console.error("Erro ao buscar estados:", err);
      res.status(500).send("Erro ao buscar estados");
      return;
    }
    res.send(results);
  });
});

router.post("/", (req, res) => {
  const estado = req.body;
  req.db.query("INSERT INTO estados SET ?", estado, (err, results) => {
    if (err) {
      console.error("Erro ao inserir estado:", err);
      res.status(500).send("Erro ao inserir estado");
      return;
    }
    res.send(results);
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const estado = req.body;
  req.db.query(
    "UPDATE estados SET ? WHERE id = ?",
    [estado, id],
    (err, results) => {
      if (err) {
        console.error("Erro ao atualizar estado:", err);
        res.status(500).send("Erro ao atualizar estado");
        return;
      }
      res.send(results);
    }
  );
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  req.db.query("DELETE FROM estados WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar estado:", err);
      res.status(500).send("Erro ao deletar estado");
      return;
    }
    res.send(results);
  });
});

module.exports = router;
