const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    req.db.query("SELECT * FROM igreja", (err, results) => {
      if (err) {
        console.error("Error fetching igrejas:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    });
  });
  
  router.post("/", (req, res) => {
    const igreja = req.body;
    req.db.query("INSERT INTO igreja SET ?", igreja, (err, results) => {
      if (err) {
        console.error("Error inserting igreja:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    });
  });
  
  router.put("/:id", (req, res) => {
    const id = req.params.id;
    const igreja = req.body;
  
    // Certifique-se de que 'ativo' é convertido de booleano para inteiro antes de salvar no banco
    const igrejaToUpdate = { ...igreja, ativo: igreja.ativo ? 1 : 0 };
  
    req.db.query("UPDATE igreja SET ? WHERE codigo = ?", [igrejaToUpdate, id], (err, results) => {
      if (err) {
        console.error("Error updating igreja:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    });
  });
  
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    req.db.query("DELETE FROM igreja WHERE codigo = ?", [id], (err, results) => {
      if (err) {
        console.error("Error deleting igreja:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    });
  });
  

  module.exports = router;