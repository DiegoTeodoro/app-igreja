const express = require("express");
const router = express.Router();

// Relatório de inventário
router.get("/", (req, res) => {
  const query = `
    SELECT 
      p.nome AS produto_nome, 
      i.quantidade, 
      i.data_inventario, 
      u.login AS usuario
    FROM inventario i
    JOIN produtos p ON i.produto_id = p.id
    JOIN usuarios u ON i.usuario_id = u.id
  `;

  req.db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar relatório de inventário:", err);
      return res.status(500).send("Erro ao buscar relatório de inventário");
    }
    res.json(results);
  });
});

module.exports = router;
