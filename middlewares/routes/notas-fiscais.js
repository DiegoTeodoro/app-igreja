const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const query = `
    SELECT nf.numero_nota, nf.serie, nf.data_emissao, nf.valor_total, 
           f.nome_fantasia 
    FROM nota_fiscal nf
    JOIN fornecedor f ON nf.fornecedor_id = f.id
  `;

  req.db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar notas fiscais:", err);
      return res.status(500).send("Erro ao buscar notas fiscais");
    }
    res.json(results);
  });
});

router.get("/numero/:numeroNota", (req, res) => {
  const numeroNota = req.params.numeroNota;
  const query = "SELECT * FROM nota_fiscal WHERE numero_nota = ?";

  req.db.query(query, [numeroNota], (err, results) => {
    if (err) {
      console.error("Erro ao buscar nota fiscal pelo número:", err);
      return res.status(500).send("Erro ao buscar nota fiscal");
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const notaFiscal = req.body;

  function validateAndFormatDate(date) {
    if (!date || isNaN(new Date(date).getTime())) {
      throw new Error("Data inválida");
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  try {
    const dataEmissao = validateAndFormatDate(notaFiscal.data_emissao);

    const queryNotaFiscal = `
      INSERT INTO nota_fiscal (
        numero_nota, serie, chave_acesso, fornecedor_id, data_emissao, valor_total, desconto, outros
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      notaFiscal.numero_nota,
      notaFiscal.serie,
      notaFiscal.chave_acesso,
      notaFiscal.fornecedor_id,
      dataEmissao,
      notaFiscal.valor_total,
      notaFiscal.desconto,
      notaFiscal.outros,
    ];

    req.db.query(queryNotaFiscal, params, (err, result) => {
      if (err) {
        console.error("Erro ao inserir nota fiscal:", err);
        return res.status(500).send("Erro ao inserir nota fiscal");
      }

      const notaFiscalId = result.insertId;
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

      req.db.query(queryItens, [values], (err) => {
        if (err) {
          console.error("Erro ao inserir itens da nota fiscal:", err);
          return res.status(500).send("Erro ao inserir itens da nota fiscal");
        }

        res.status(201).json({ message: "Nota Fiscal e itens salvos com sucesso" });
      });
    });
  } catch (err) {
    console.error("Erro ao validar a data:", err.message);
    res.status(400).send("Data inválida fornecida.");
  }
});

module.exports = router;
