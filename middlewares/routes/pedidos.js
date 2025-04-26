const express = require("express");
const router = express.Router();

// Função auxiliar para formatar a data
function formatDateToMySQL(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const hours = ('0' + d.getHours()).slice(-2);
  const minutes = ('0' + d.getMinutes()).slice(-2);
  const seconds = ('0' + d.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Criar pedido com itens
router.post("/", (req, res) => {
  const pedido = req.body;
  const dataPedidoMySQL = formatDateToMySQL(pedido.data_pedido);

  const queryPedido = `
    INSERT INTO pedidos (igreja_id, data_pedido, status, valor_total, recebedor)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    pedido.igreja_id,
    dataPedidoMySQL,
    pedido.status,
    pedido.valor_total,
    pedido.recebedor,
  ];

  req.db.query(queryPedido, params, (err, result) => {
    if (err) {
      console.error("Erro ao inserir o pedido:", err);
      return res.status(500).send("Erro ao inserir o pedido");
    }

    const pedidoId = result.insertId;
    const itens = pedido.pedido_itens.map(item => [
      pedidoId,
      item.produto_id,
      item.quantidade,
      item.valor_unitario
    ]);

    const queryItens = `
      INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, valor_unitario)
      VALUES ?
    `;

    req.db.query(queryItens, [itens], (err) => {
      if (err) {
        console.error("Erro ao inserir itens do pedido:", err);
        return res.status(500).send("Erro ao inserir itens do pedido");
      }

      res.status(201).send("Pedido e itens salvos com sucesso");
    });
  });
});

// Consultar todos os pedidos com filtro
router.get("/", (req, res) => {
  const { igreja, dataInicio, dataFim } = req.query;

  let query = `
    SELECT 
      p.id AS pedido_id, 
      p.data_pedido, 
      p.valor_total, 
      i.nome AS igreja_nome,
      ip.produto_id, 
      pr.nome AS produto_nome,
      ip.quantidade, 
      ip.valor_unitario, 
      ip.valor_total
    FROM pedidos p
    JOIN igreja i ON p.igreja_id = i.codigo
    JOIN itens_pedido ip ON p.id = ip.pedido_id
    JOIN produtos pr ON ip.produto_id = pr.id
    WHERE 1 = 1
  `;

  const params = [];

  if (igreja) {
    query += " AND i.nome LIKE ?";
    params.push(`%${igreja}%`);
  }

  if (dataInicio) {
    query += " AND p.data_pedido >= ?";
    params.push(dataInicio);
  }

  if (dataFim) {
    query += " AND p.data_pedido <= ?";
    params.push(dataFim);
  }

  req.db.query(query, params, (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedidos:", err);
      return res.status(500).send("Erro ao buscar pedidos");
    }

    res.send(results);
  });
});

// Buscar pedido por ID
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT p.id AS codigo, p.*, i.nome AS igreja_nome 
    FROM pedidos p 
    JOIN igreja i ON p.igreja_id = i.codigo 
    WHERE p.id = ?
  `;

  req.db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedido:", err);
      return res.status(500).send("Erro ao buscar pedido");
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Pedido não encontrado");
    }
  });
});

module.exports = router;
