const express = require("express");
const router = express.Router();

// Buscar todos os saldos de estoque
router.get("/", (req, res) => {
  const query = `
    SELECT se.produto_id, p.nome AS produto_nome, se.quantidade, se.valor_unitario, se.valor_total
    FROM saldo_estoque se
    JOIN produtos p ON se.produto_id = p.id
  `;
  req.db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar saldo de estoque:", err);
      res.status(500).send("Erro ao buscar saldo de estoque");
    } else {
      res.json(results);
    }
  });
});

// Buscar saldo de estoque de um produto específico
router.get("/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;

  const query = `
    SELECT se.*, p.nome AS produto_nome
    FROM saldo_estoque se
    JOIN produtos p ON se.produto_id = p.id
    WHERE se.produto_id = ?
  `;

  req.db.query(query, [produtoId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar saldo de estoque:", err);
      res.status(500).send("Erro ao buscar saldo de estoque");
    } else if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send("Produto não encontrado no saldo de estoque");
    }
  });
});

// Atualizar saldo de estoque ao dar entrada de nota fiscal
router.put("/update/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;
  const { quantidade, valor_unitario } = req.body;

  const querySelect = "SELECT quantidade, valor_unitario FROM saldo_estoque WHERE produto_id = ?";
  
  req.db.query(querySelect, [produtoId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar saldo de estoque:", err);
      return res.status(500).send("Erro ao buscar saldo de estoque");
    }

    if (result.length > 0) {
      const saldoAtual = result[0];
      const novaQuantidade = saldoAtual.quantidade + quantidade;
      const novoValorUnitario = valor_unitario !== saldoAtual.valor_unitario
        ? valor_unitario
        : saldoAtual.valor_unitario;

      const queryUpdate = `
        UPDATE saldo_estoque 
        SET quantidade = ?, valor_unitario = ?, updated_at = NOW()
        WHERE produto_id = ?
      `;
      req.db.query(queryUpdate, [novaQuantidade, novoValorUnitario, produtoId], (err) => {
        if (err) {
          console.error("Erro ao atualizar saldo de estoque:", err);
          return res.status(500).send("Erro ao atualizar saldo de estoque");
        }

        res.send("Saldo de estoque atualizado com sucesso.");
      });
    } else {
      res.status(404).send("Produto não encontrado no saldo de estoque");
    }
  });
});

// Atualizar saldo ao realizar pedido (baixa de estoque)
router.put("/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;
  const quantidadeVendida = req.body.quantidade;

  const query = `
    UPDATE saldo_estoque 
    SET quantidade = quantidade - ?
    WHERE produto_id = ?
  `;

  req.db.query(query, [quantidadeVendida, produtoId], (err) => {
    if (err) {
      console.error("Erro ao atualizar saldo de estoque:", err);
      return res.status(500).send("Erro ao atualizar saldo de estoque");
    }

    res.send("Saldo de estoque atualizado com sucesso");
  });
});

module.exports = router;
