const express = require("express");
const router = express.Router();

// Cadastro em lote de inventários
router.post("/lote", (req, res) => {
  const inventarios = req.body; // Deve ser um array de objetos
  const query = `
      INSERT INTO inventario (produto_id, usuario_id, quantidade, data_inventario, observacao)
      VALUES ?
  `;

  const values = inventarios.map(item => [
    item.produto_id,
    item.usuario_id,
    item.quantidade,
    item.data_inventario,
    item.observacao,
  ]);

  req.db.query(query, [values], (err, result) => {
    if (err) {
      console.error("Erro ao salvar inventário:", err);
      return res.status(500).json({ message: "Erro ao salvar inventário." });
    }
    res.status(201).json({ message: "Inventário salvo com sucesso.", insertId: result.insertId });
  });
});

module.exports = router;
