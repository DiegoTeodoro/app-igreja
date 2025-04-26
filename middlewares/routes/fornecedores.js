const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    req.db.query("SELECT * FROM fornecedor", (err, results) => {
      if (err) {
        console.error("Error fetching fornecedores:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log(results); // Verifica se os fornecedores estão sendo retornados
      res.send(results);
    });
  });
  
  router.post("/", (req, res) => {
    const fornecedor = req.body;
    req.db.query(
      "INSERT INTO fornecedor SET ?",
      fornecedor,
      (err, results) => {
        if (err) {
          console.error("Error inserting fornecedor:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.send(results);
      }
    );
  });
  
  router.put("/:id", (req, res) => {
    const id = req.params.id;
    const fornecedor = req.body;
    req.db.query(
      "UPDATE fornecedor SET ? WHERE id = ?",
      [fornecedor, id],
      (err, results) => {
        if (err) {
          console.error("Error updating fornecedor:", err);
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
      "DELETE FROM fornecedor WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error deleting fornecedor:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.send(results);
      }
    );
  });

  module.exports = router;