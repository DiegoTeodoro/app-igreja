const express = require("express");
const router = express.Router();

router.get("/:nota_fiscal_id", (req, res) => {
  const id = req.params.nota_fiscal_id;
  const query = "SELECT * FROM itens_nota_fiscal WHERE nota_fiscal_id = ?";

  req.db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar itens da nota fiscal:", err);
      return res.status(500).send("Erro ao buscar itens da nota fiscal");
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const itens = req.body.itensNotaFiscal;

  const queryItens = `
  INSERT INTO itens_nota_fiscal (nota_fiscal_id, produto_id, quantidade, valor_unitario)
  VALUES ?
`;

const values = notaFiscal.itensNotaFiscal.map(item => [
  notaFiscalId,
  item.produto_id,
  item.quantidade,
  item.valorUnitario
]);

  req.db.query(query, [values], (err) => {
    if (err) {
      console.error("Erro ao inserir itens da nota fiscal:", err);
      return res.status(500).send("Erro ao inserir itens da nota fiscal");
    }
    res.status(201).send("Itens da Nota Fiscal inseridos com sucesso");
  });
});

module.exports = router;
