const express = require("express");
const router = express.Router();

// Criar novo pedido de compra com itens
router.post("/", (req, res) => {
  const { solicitante, data_pedido, itens } = req.body;

  if (!solicitante || !data_pedido || !itens || itens.length === 0) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  const queryPedido = "INSERT INTO pedido_compra (solicitante, data) VALUES (?, ?)";

  req.db.query(queryPedido, [solicitante, data_pedido], (err, result) => {
    if (err) {
      console.error("Erro ao inserir pedido:", err);
      return res.status(500).json({ error: "Erro ao salvar pedido." });
    }

    const pedidoId = result.insertId;

    const itensValues = itens.map(item => [pedidoId, item.produto_id, item.quantidade]);
    const queryItens = "INSERT INTO pedido_compra_itens (pedido_id, produto_id, quantidade) VALUES ?";

    req.db.query(queryItens, [itensValues], (err) => {
      if (err) {
        console.error("Erro ao inserir itens do pedido:", err);
        return res.status(500).json({ error: "Erro ao salvar itens do pedido." });
      }

      res.status(201).json({ message: "Pedido e itens salvos com sucesso" });
    });
  });
});

// Relatório por data
router.get("/relatorio", (req, res) => {
  const { dataInicio, dataFim } = req.query;

  if (!dataInicio || !dataFim) {
    return res.status(400).send("Os parâmetros dataInicio e dataFim são obrigatórios.");
  }

  const query = `
    SELECT pc.id AS codigo, p.nome AS produto, pci.quantidade, pc.data AS dataPedido
    FROM pedido_compra pc
    JOIN pedido_compra_itens pci ON pc.id = pci.pedido_id
    JOIN produtos p ON pci.produto_id = p.id
    WHERE pc.data BETWEEN ? AND ?
  `;

  req.db.query(query, [dataInicio, dataFim], (err, results) => {
    if (err) {
      console.error("Erro ao buscar relatório de pedidos de compra:", err);
      return res.status(500).send("Erro ao buscar relatório de pedidos de compra");
    }
    res.json(results);
  });
});

// Buscar pedido de compra por ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM pedido_compra WHERE id = ?";

  req.db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedido de compra:", err);
      return res.status(500).send("Erro ao buscar pedido de compra");
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Pedido de compra não encontrado");
    }
  });
});

module.exports = router;
