const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.db.query("SELECT * FROM setor", (err, results) => {
    if (err) return res.status(500).send("Erro ao buscar setores");
    res.send(results);
  });
});

router.post("/", (req, res) => {
  const setor = req.body;
  req.db.query("INSERT INTO setor SET ?", setor, (err, results) => {
    if (err) return res.status(500).send("Erro ao inserir setor");
    res.send(results);
  });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const setor = req.body;
    req.db.query(
      "UPDATE setor SET ? WHERE codigo = ?",
      [setor, id],
      (err, results) => {
        if (err) {
          console.error("Error updating setor:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.send(results);
      }
    );
  });
  
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    req.db.query(
      "DELETE FROM setor WHERE codigo = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error deleting setor:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.send(results);
      }
    );
  });

module.exports = router;