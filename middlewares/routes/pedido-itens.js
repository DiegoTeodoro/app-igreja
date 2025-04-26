const express = require("express");
const router = express.Router();

router.get("/:pedidoId", (req, res) => {
  const pedidoId = req.params.pedidoId;
  const query = `
    SELECT ip.*, p.nome AS produto_nome
    FROM itens_pedido ip
    JOIN produtos p ON ip.produto_id = p.id
    WHERE ip.pedido_id = ?
  `;

  req.db.query(query, [pedidoId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar itens do pedido:", err);
      return res.status(500).send("Erro ao buscar itens do pedido");
    }

    res.json(results); // Pode retornar array vazio
  });
});

module.exports = router;
