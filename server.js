const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const { SECRET_KEY } = require('./config'); // Importando a chave secreta
const verifyToken = require('./middlewares/auth'); // Ajuste o caminho conforme necessário
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());



const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "igreja_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});


// CRUD APIs for 'setor'
app.get("/setores", (req, res) => {
  connection.query("SELECT * FROM setor", (err, results) => {
    if (err) {
      console.error("Error fetching setores:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

app.post("/setores", (req, res) => {
  const setor = req.body;
  connection.query("INSERT INTO setor SET ?", setor, (err, results) => {
    if (err) {
      console.error("Error inserting setor:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

app.put("/setores/:id", (req, res) => {
  const id = req.params.id;
  const setor = req.body;
  connection.query(
    "UPDATE setor SET ? WHERE codigo = ?",
    [setor, id],
    (err, results) => {
      if (err) {
        console.error("Error updating setor:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    }
  );
});

app.delete("/setores/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM setor WHERE codigo = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting setor:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    }
  );
});

// Repita o mesmo tratamento de erro para as demais APIs

// CRUD APIs for 'igreja'
app.get("/igrejas", (req, res) => {
  connection.query("SELECT * FROM igreja", (err, results) => {
    if (err) {
      console.error("Error fetching igrejas:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

app.post("/igrejas", (req, res) => {
  const igreja = req.body;
  connection.query("INSERT INTO igreja SET ?", igreja, (err, results) => {
    if (err) {
      console.error("Error inserting igreja:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

app.put("/igrejas/:id", (req, res) => {
  const id = req.params.id;
  const igreja = req.body;

  // Certifique-se de que 'ativo' é convertido de booleano para inteiro antes de salvar no banco
  const igrejaToUpdate = { ...igreja, ativo: igreja.ativo ? 1 : 0 };

  connection.query("UPDATE igreja SET ? WHERE codigo = ?", [igrejaToUpdate, id], (err, results) => {
    if (err) {
      console.error("Error updating igreja:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});


app.delete("/igrejas/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM igreja WHERE codigo = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting igreja:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});


// CRUD APIs for 'estados'
app.get("/estados", (req, res) => {
  connection.query("SELECT * FROM estados", (err, results) => {
    if (err) {
      console.error("Erro ao buscar estados:", err);
      res.status(500).send("Erro ao buscar estados");
      return;
    }
    res.send(results);
  });
});


app.post("/estados", (req, res) => {
  const estado = req.body;
  connection.query("INSERT INTO estados SET ?", estado, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put("/estados/:id", (req, res) => {
  const id = req.params.id;
  const estado = req.body;
  connection.query(
    "UPDATE estados SET ? WHERE id = ?",
    [estado, id],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/estados/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM estados WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// CRUD APIs for 'cidades'
app.get("/cidades", (req, res) => {
  connection.query("SELECT * FROM cidades", (err, results) => {
    if (err) {
      console.error("Erro ao buscar cidades:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("Cidades obtidas do banco de dados:", results);
    res.send(results);
  });
});
app.post("/cidades", (req, res) => {
  const cidade = req.body;
  connection.query("INSERT INTO cidades SET ?", cidade, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put("/cidades/:id", (req, res) => {
  const id = req.params.id;
  const cidade = req.body;
  connection.query(
    "UPDATE cidades SET ? WHERE id = ?",
    [cidade, id],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/cidades/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM cidades WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
// CRUD APIs for 'produtos'

// Get all products
app.get("/produtos", (req, res) => {
  const query = `
    SELECT p.id, p.nome, p.volume, p.codigo_barras, p.marca, c.nome AS categoria_nome, f.nome_fantasia AS fornecedor_nome
    FROM produtos p
    JOIN categoria c ON p.categoria_id = c.id
    JOIN fornecedor f ON p.fornecedor_id = f.id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      res.status(500).send("Erro ao buscar produtos");
    } else {
      res.json(results);
    }
  });
});


// Get a single product by ID
app.get("/produtos/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM produtos WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Produto não encontrado");
    }
  });
});

app.get("/produtos/nome/:nome", (req, res) => {
  const nome = req.params.nome;
  const query = "SELECT * FROM produtos WHERE nome = ?";
  connection.query(query, [nome], (err, results) => {
    if (err) {
      console.error("Erro ao buscar produto pelo nome:", err);
      res.status(500).send("Erro ao buscar produto");
    } else if (results.length > 0) {
      res.json(results[0]); // Retorna o primeiro produto encontrado
    } else {
      res.status(404).send("Produto não encontrado");
    }
  });
});

// Create a new product
app.post("/produtos", (req, res) => {
  const produto = req.body;
  const query = "INSERT INTO produtos SET ?";
  connection.query(query, produto, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ id: results.insertId, ...produto });
    }
  });
});

// Update an existing product by ID
app.put("/produtos/:id", (req, res) => {
  const id = req.params.id;
  const produto = req.body;
  const query = "UPDATE produtos SET ? WHERE id = ?";
  connection.query(query, [produto, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Produto atualizado com sucesso");
    }
  });
});

// Delete a product by ID
app.delete("/produtos/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM produtos WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Produto deletado com sucesso");
    }
  });
});

// CRUD APIs for 'fornecedor'
app.get("/fornecedores", (req, res) => {
  connection.query("SELECT * FROM fornecedor", (err, results) => {
    if (err) {
      console.error("Error fetching fornecedores:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log(results); // Verifica se os fornecedores estão sendo retornados
    res.send(results);
  });
});


app.post("/fornecedores", (req, res) => {
  const fornecedor = req.body;
  connection.query(
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

app.put("/fornecedores/:id", (req, res) => {
  const id = req.params.id;
  const fornecedor = req.body;
  connection.query(
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

app.delete("/fornecedores/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
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

// CRUD APIs for 'categoria'
app.get("/categorias", (req, res) => {
  connection.query("SELECT * FROM categoria", (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

// Get a single category by ID
app.get("/categorias/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM categoria WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching category:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      if (results.length > 0) {
        res.send(results[0]);
      } else {
        res.status(404).send("Categoria not found");
      }
    }
  );
});

// Create a new category
app.post("/categorias", (req, res) => {
  const categoria = req.body;
  connection.query("INSERT INTO categoria SET ?", categoria, (err, results) => {
    if (err) {
      console.error("Error inserting categoria:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

// Update an existing category by ID
app.put("/categorias/:id", (req, res) => {
  const id = req.params.id;
  const categoria = req.body;
  connection.query(
    "UPDATE categoria SET ? WHERE id = ?",
    [categoria, id],
    (err, results) => {
      if (err) {
        console.error("Error updating categoria:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    }
  );
});

// Delete a category by ID
app.delete("/categorias/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM categoria WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting categoria:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    }
  );
});


// Rota para buscar o preço unitário pelo produto_id
app.get("/saldo-estoque/preco/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;
  const query = "SELECT valor_unitario FROM saldo_estoque WHERE produto_id = ?";
  
  connection.query(query, [produtoId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar preço unitário:", err);
      res.status(500).send("Erro ao buscar preço unitário");
    } else {
      if (result.length > 0) {
        res.json({ preco_unitario: result[0].valor_unitario });
      } else {
        res.status(404).send("Produto não encontrado no saldo de estoque");
      }
    }
  });
});


// Rota para buscar todos os registros de saldo_estoque
app.get("/saldo-estoque", (req, res) => {
  const query = `
    SELECT se.produto_id, p.nome AS produto_nome, se.quantidade, se.valor_unitario, se.valor_total
FROM saldo_estoque se
JOIN produtos p ON se.produto_id = p.id;

  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar saldo de estoque:", err);
      res.status(500).send("Erro ao buscar saldo de estoque");
    } else {
      res.json(results);
    }
  });
});

// Rota para buscar o preço unitário pelo produto_id
app.get("/saldo-estoque/preco/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;
  const query = "SELECT valor_unitario FROM saldo_estoque WHERE produto_id = ?";
  
  connection.query(query, [produtoId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar preço unitário:", err);
      res.status(500).send("Erro ao buscar preço unitário");
    } else {
      if (result.length > 0) {
        res.json({ preco_unitario: result[0].valor_unitario });
      } else {
        res.status(404).send("Produto não encontrado no saldo de estoque");
      }
    }
  });
});

// Rota para atualizar saldo de estoque ao dar entrada de nota fiscal
app.put("/saldo-estoque/update/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;
  const { quantidade, valor_unitario } = req.body;

  // Primeiro, obter o valor unitário atual e quantidade do saldo_estoque
  const querySelect = `SELECT quantidade, valor_unitario FROM saldo_estoque WHERE produto_id = ?`;
  
  connection.query(querySelect, [produtoId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar saldo de estoque:", err);
      res.status(500).send("Erro ao buscar saldo de estoque");
      return;
    }

    if (result.length > 0) {
      const saldoAtual = result[0];
      let novaQuantidade = saldoAtual.quantidade + quantidade;
      let novoValorUnitario = saldoAtual.valor_unitario;

      // Se o valor unitário da nota for diferente, atualizamos o valor
      if (saldoAtual.valor_unitario !== valor_unitario) {
        novoValorUnitario = valor_unitario;
      }

      // Atualiza a quantidade e, se necessário, o valor unitário no saldo de estoque
      const queryUpdate = `
        UPDATE saldo_estoque 
        SET quantidade = ?, valor_unitario = ?, updated_at = NOW()
        WHERE produto_id = ?
      `;
      connection.query(queryUpdate, [novaQuantidade, novoValorUnitario, produtoId], (err, result) => {
        if (err) {
          console.error("Erro ao atualizar saldo de estoque:", err);
          res.status(500).send("Erro ao atualizar saldo de estoque");
          return;
        }

        res.send("Saldo de estoque atualizado com sucesso.");
      });
    } else {
      res.status(404).send("Produto não encontrado no saldo de estoque");
    }
  });
});
app.get("/notas-fiscais", (req, res) => {
  const query = `
    SELECT nf.numero_nota, nf.serie, nf.data_emissao, nf.valor_total, 
           f.nome_fantasia 
    FROM nota_fiscal nf
    JOIN fornecedor f ON nf.fornecedor_id = f.id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar notas fiscais:", err);
      res.status(500).send("Erro ao buscar notas fiscais");
      return;
    }
    res.json(results);
  });
});

app.get("/notas-fiscais", (req, res) => {
  console.log("Rota /notas-fiscais foi chamada");
  connection.query("SELECT * FROM nota_fiscal", (err, results) => {
    if (err) {
      console.error("Erro ao buscar notas fiscais:", err);
      res.status(500).send("Erro ao buscar notas fiscais");
      return;
    }
    console.log("Notas Fiscais encontradas:", results); // Log para ver o resultado
    res.json(results);
  });
});

app.get('/notas-fiscais/numero/:numeroNota', (req, res) => {
  const numeroNota = req.params.numeroNota;
  const query = 'SELECT * FROM nota_fiscal WHERE numero_nota = ?';

  connection.query(query, [numeroNota], (err, results) => {
    if (err) {
      console.error('Erro ao buscar nota fiscal pelo número:', err);
      res.status(500).send('Erro ao buscar nota fiscal');
    } else {
      res.json(results); // Retorna um array de notas, vazio se não houver duplicidade
    }
  });
});
app.get("/itens-nota-fiscal/:nota_fiscal_id", (req, res) => {
  const notaFiscalId = req.params.nota_fiscal_id;

  const query = `
    SELECT * FROM itens_nota_fiscal 
    WHERE nota_fiscal_id = ?
  `;

  connection.query(query, [notaFiscalId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar itens da nota fiscal:", err);
      res.status(500).send("Erro ao buscar itens da nota fiscal");
      return;
    }
    res.json(results);
  });
});

app.get('/notas-fiscais/numero/:numeroNota', (req, res) => {
  const numeroNota = req.params.numeroNota;
  const query = 'SELECT * FROM nota_fiscal WHERE numero_nota = ?';

  connection.query(query, [numeroNota], (err, results) => {
    if (err) {
      console.error('Erro ao buscar nota fiscal pelo número:', err);
      res.status(500).send('Erro ao buscar nota fiscal');
    } else {
      res.json(results); // Retorna um array de notas, vazio se não houver duplicidade
    }
  });
});


// Função para formatar data no formato 'YYYY-MM-DD'
function formatDateToMySQL(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

// Rota para salvar a nota fiscal e os itens da nota fiscal
app.post("/notas-fiscais", (req, res) => {
  const notaFiscal = req.body;

  const queryNotaFiscal = `
      INSERT INTO nota_fiscal (
          numero_nota, serie, chave_acesso, fornecedor_id, data_emissao, valor_total, desconto, outros
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const paramsNotaFiscal = [
      notaFiscal.numero_nota,
      notaFiscal.serie,
      notaFiscal.chave_acesso,
      notaFiscal.fornecedor_id,
      notaFiscal.data_emissao,
      notaFiscal.valor_total,
      notaFiscal.desconto,
      notaFiscal.outros
  ];

  // Inserindo o cabeçalho da nota fiscal
  connection.query(queryNotaFiscal, paramsNotaFiscal, (err, result) => {
      if (err) {
          console.error("Erro ao inserir nota fiscal:", err);
          res.status(500).send("Erro ao inserir nota fiscal");
          return;
      }

      const notaFiscalId = result.insertId; // ID da nota fiscal inserida

      // Inserir itens da nota fiscal
      const itensNotaFiscal = notaFiscal.itensNotaFiscal.map(item => [
          notaFiscalId,                // Usar o ID da nota fiscal
          item.produto_id,              // ID do produto
          item.quantidade,              // Quantidade do item
          item.valorUnitario,           // Valor unitário do item
          item.valorTotal               // Valor total do item
      ]);

      const queryItensNotaFiscal = `
          INSERT INTO itens_nota_fiscal (nota_fiscal_id, produto_id, quantidade, valor_unitario, valor_total)
          VALUES ?
      `;

      connection.query(queryItensNotaFiscal, [itensNotaFiscal], (err) => {
          if (err) {
              console.error("Erro ao inserir itens da nota fiscal:", err);
              res.status(500).send("Erro ao inserir itens da nota fiscal");
              return;
          }

          res.status(201).json({ message: "Nota Fiscal e itens salvos com sucesso" });
      });
  });
});

app.post("/itens-nota-fiscal", (req, res) => {
  const itensNotaFiscal = req.body.itensNotaFiscal;

  const query = `
    INSERT INTO itens_nota_fiscal (nota_fiscal_id, produto_id, quantidade, valor_unitario, valor_total)
    VALUES ?
  `;

  const values = itensNotaFiscal.map(item => [
    item.nota_fiscal_id,
    item.produto_id,
    item.quantidade,
    item.valorUnitario,  // Certifique-se de que os valores corretos estão sendo passados
    item.valorTotal      // Aqui você deve calcular o valor total corretamente
  ]);

  connection.query(query, [values], (err, result) => {
    if (err) {
      console.error("Erro ao inserir itens da nota fiscal:", err);
      res.status(500).send("Erro ao inserir itens da nota fiscal");
    } else {
      res.status(201).send("Itens da Nota Fiscal inseridos com sucesso");
    }
  });
});

// Rota para buscar o saldo de estoque de um produto específico
app.get("/saldo-estoque/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;

  const query = `
    SELECT se.*, p.nome AS produto_nome
    FROM saldo_estoque se
    JOIN produtos p ON se.produto_id = p.id
    WHERE se.produto_id = ?
  `;

  connection.query(query, [produtoId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar saldo de estoque:", err);
      res.status(500).send("Erro ao buscar saldo de estoque");
    } else if (result.length > 0) {
      res.json(result[0]); // Retorna o primeiro item, que é o saldo de estoque do produto
    } else {
      res.status(404).send("Produto não encontrado no saldo de estoque");
    }
  });
});

// Função para converter a data no formato 'YYYY-MM-DD HH:MM:SS'
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


// No código de inserção do pedido
app.post("/pedidos", (req, res) => {
  const pedido = req.body;

  // Converte a data para o formato adequado
  const dataPedidoMySQL = formatDateToMySQL(pedido.data_pedido);

  const queryPedido = `
    INSERT INTO pedidos (igreja_id, data_pedido, status, valor_total, recebedor)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const paramsPedido = [
    pedido.igreja_id,
    dataPedidoMySQL,  // Data formatada corretamente
    pedido.status,
    pedido.valor_total,
    pedido.recebedor
  ];

  connection.query(queryPedido, paramsPedido, (err, result) => {
    if (err) {
      console.error("Erro ao inserir o pedido:", err);
      res.status(500).send("Erro ao inserir o pedido");
      return;
    }

    const pedidoId = result.insertId;

    // Inserir itens do pedido
const itensPedido = pedido.pedido_itens.map(item => [
  pedidoId,
  item.produto_id,
  item.quantidade,
  item.valor_unitario
]);

const queryItensPedido = `
  INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, valor_unitario)
  VALUES ?
`;

connection.query(queryItensPedido, [itensPedido], (err) => {
  if (err) {
    console.error("Erro ao inserir itens do pedido:", err);
    res.status(500).send("Erro ao inserir itens do pedido");
    return;
  }

  res.status(201).send("Pedido e itens salvos com sucesso");
});
  });
});

// relatorio de pedido
app.get('/pedidos', (req, res) => {
  const { igreja, dataInicio, dataFim } = req.query;

  // Adjusted query to include the `codigo` column
   const query = `
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
  JOIN produtos pr ON ip.produto_id = pr.id;
`;

  const params = [];

  if (igreja) {
    query += ' AND i.nome LIKE ?';
    params.push(`%${igreja}%`);
  }

  if (dataInicio) {
    query += ' AND p.data_pedido >= ?';
    params.push(dataInicio);
  }

  if (dataFim) {
    query += ' AND p.data_pedido <= ?';
    params.push(dataFim);
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      res.status(500).send('Erro ao buscar pedidos');
      return;
    }

    res.send(results);
  });
});

app.get("/pedidos/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT p.id AS codigo, p.*, i.nome AS igreja_nome 
    FROM pedidos p 
    JOIN igreja i ON p.igreja_id = i.codigo 
    WHERE p.id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedido:", err);
      res.status(500).send("Erro ao buscar pedido");
    } else if (results.length > 0) {
      res.json(results[0]); // Retorna o pedido encontrado com o nome da igreja
    } else {
      res.status(404).send("Pedido não encontrado");
    }
  });
});

app.get('/pedidos', (req, res) => {
  connection.query('SELECT ...', (err, results) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      res.status(500).send('Erro ao buscar pedidos');
    } else {
      console.log('Resultados:', results); // Verifique os dados aqui
      res.json(results);
    }
  });
});


// Rota para atualizar o saldo de estoque ao realizar um pedido
app.put("/saldo-estoque/:produto_id", (req, res) => {
  const produtoId = req.params.produto_id;
  const quantidadeVendida = req.body.quantidade;  // A quantidade que será deduzida do estoque

  const query = `
    UPDATE saldo_estoque 
    SET quantidade = quantidade - ?
    WHERE produto_id = ?
  `;

  connection.query(query, [quantidadeVendida, produtoId], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar saldo de estoque:", err);
      res.status(500).send("Erro ao atualizar saldo de estoque");
      return;
    }

    res.send("Saldo de estoque atualizado com sucesso");
  });
});

// Get all empresas
app.get("/empresas", (req, res) => {
  connection.query("SELECT * FROM empresa", (err, results) => {
    if (err) {
      console.error("Error fetching empresas:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

// Get a single empresa by ID
app.get("/empresas/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM empresa WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Empresa não encontrada");
    }
  });
});

// Create a new empresa
app.post("/empresas", (req, res) => {
  const empresa = req.body;

  // Adicione um console.log para verificar os dados
  console.log(empresa);

  connection.query("INSERT INTO empresa SET ?", empresa, (err, results) => {
    if (err) {
      console.error("Erro ao inserir empresa:", err);
      res.status(500).send("Erro ao inserir empresa");
    } else {
      res.status(201).send({ id: results.insertId, ...empresa });
    }
  });
});

// Update an existing empresa by ID
app.put("/empresas/:id", (req, res) => {
  const id = req.params.id;
  const empresa = req.body;
  connection.query("UPDATE empresa SET ? WHERE id = ?", [empresa, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Empresa atualizada com sucesso");
    }
  });
});

// Delete an empresa by ID
app.delete("/empresas/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM empresa WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Empresa deletada com sucesso");
    }
  });
});

app.post("/empresas/pesquisar", (req, res) => {
  const { razao_social, cnpj } = req.body;
  
  // Exemplo de query SQL - modifique conforme seu banco de dados
  const query = `
    SELECT * FROM empresa 
    WHERE razao_social LIKE ? 
    OR cnpj = ?
  `;
  
  connection.query(query, [`%${razao_social}%`, cnpj], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
    res.json(results);
  });
});

app.post("/pedidos", (req, res) => {
  const pedido = req.body;
  console.log("Pedido recebido:", pedido);  // Log dos dados recebidos

  // Converte a data para o formato adequado
  const dataPedidoMySQL = formatDateToMySQL(pedido.data_pedido);

  const queryPedido = `
    INSERT INTO pedidos (igreja_id, data_pedido, status, valor_total, recebedor)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const paramsPedido = [
    pedido.igreja_id,
    dataPedidoMySQL,  // Data formatada corretamente
    pedido.status,
    pedido.valor_total,
    pedido.recebedor
  ];

  // Inserir o pedido
connection.query(queryPedido, paramsPedido, (err, result) => {
  if (err) {
    console.error("Erro ao inserir o pedido:", err); // <-- Verifique a mensagem de erro aqui
    res.status(500).send("Erro ao inserir o pedido");
    return;
  }

  const pedidoId = result.insertId;

  // Inserir os itens do pedido
  const itensPedido = pedido.pedido_itens.map(item => [
    pedidoId,
    item.produto_id,
    item.quantidade,
    item.valor_unitario
  ]);

  const queryItensPedido = `
    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, valor_unitario)
    VALUES ?
  `;

  connection.query(queryItensPedido, [itensPedido], (err) => {
    if (err) {
      console.error("Erro ao inserir itens do pedido:", err); // <-- Verifique a mensagem de erro aqui
      res.status(500).send("Erro ao inserir itens do pedido");
      return;
    }

    res.status(201).send("Pedido e itens salvos com sucesso");
  });
});

});

app.get('/pedidos', (req, res) => {
  const query = `
    SELECT 
      p.id AS pedido_id, 
      p.data_pedido, 
      p.recebedor, 
      p.valor_total, 
      i.nome AS igreja_nome
    FROM pedidos p
    JOIN igreja i ON p.igreja_id = i.codigo;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      res.status(500).send('Erro ao buscar pedidos');
      return;
    }

    console.log('Pedidos retornados:', results); // Verifique os campos aqui
    res.json(results);
  });
});
app.get('/pedidos/:id', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT p.id AS pedido_id, p.data_pedido, p.valor_total, p.recebedor, i.nome AS igreja_nome
    FROM pedidos p
    JOIN igreja i ON p.igreja_id = i.codigo
    WHERE p.id = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar pedido:', err);
      res.status(500).send('Erro ao buscar pedido');
      return;
    }
    if (results.length > 0) {
      res.json(results[0]); // Retorna o pedido encontrado
    } else {
      res.status(404).send('Pedido não encontrado');
    }
  });
});


// Rota para buscar pedido por código do pedido
app.get("/pedidos/:codigoPedido", (req, res) => {
  const codigoPedido = req.params.codigoPedido;
  const query = `
    SELECT p.*, i.nome AS igreja_nome 
    FROM pedidos p
    JOIN igreja i ON p.igreja_id = i.codigo 
    WHERE p.id = ?
  `;
  
  connection.query(query, [codigoPedido], (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedido:", err);
      res.status(500).send("Erro ao buscar pedido");
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Pedido não encontrado");
    }
  });
});

app.get("/pedido-itens/:pedidoId", (req, res) => {
  const pedidoId = req.params.pedidoId;
  const query = `
    SELECT ip.*, p.nome AS produto_nome
    FROM itens_pedido ip
    JOIN produtos p ON ip.produto_id = p.id
    WHERE ip.pedido_id = ?
  `;
  
  connection.query(query, [pedidoId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar itens do pedido:", err);
      res.status(500).send("Erro ao buscar itens do pedido");
    } else {
      res.json(results); // Deve retornar um array de itens, mesmo que vazio
    }
  });
});

// CRUD APIs for 'usuario'
app.post("/usuarios", (req, res) => {
  const usuario = req.body;

  console.log("Dados recebidos para cadastro de usuário:", usuario);

  const query = "INSERT INTO usuarios SET ?";
  connection.query(query, usuario, (err, results) => {
    if (err) {
      console.error("Erro ao inserir usuário:", err.message, err.code);
      res.status(500).send("Erro ao inserir usuário");
    } else {
      res.status(201).send({ id: results.insertId, ...usuario });
    }
  });
});

app.get("/usuarios", (req, res) => {
  connection.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err);
      res.status(500).send("Erro ao buscar usuários");
      return;
    }
    res.send(results);
  });
});

app.post('/usuarios/login', (req, res) => {
  const { login, senha } = req.body;
  const query = 'SELECT * FROM usuarios WHERE login = ? AND senha = ?';

  connection.query(query, [login, senha], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar usuário');
    }
    if (results.length > 0) {
      const usuario = results[0];
      const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({ 
        message: 'Login bem-sucedido', 
        token, 
        usuario: { id: usuario.id, nome: usuario.login, perfil: usuario.perfil } 
      });
    } else {
      res.status(401).send('Usuário ou senha inválidos');
    }
  });
});

app.put('/usuarios/:id', (req, res) => {
  const id = req.params.id; // Obtém o ID da rota
  const { login, senha, perfil, ativo } = req.body; // Obtém os dados do corpo da requisição

  const query = 'UPDATE usuarios SET login = ?, senha = ?, perfil = ?, ativo = ? WHERE id = ?';
  connection.query(query, [login, senha, perfil, ativo, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err.message);
      return res.status(500).send('Erro ao atualizar usuário');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }
    res.status(200).send({ message: 'Usuário atualizado com sucesso!' });
  });
});

const verifyAdmin = (req, res, next) => {
  if (req.userProfile !== 'Administrador') {
    return res.status(403).json({ message: 'Acesso negado: Apenas administradores podem acessar' });
  }
  next();
};

app.post('/usuarios', verifyToken, verifyAdmin, (req, res) => {
  const usuario = req.body;
  connection.query("INSERT INTO usuarios SET ?", usuario, (err, results) => {
    if (err) {
      console.error("Erro ao inserir usuário:", err);
      res.status(500).send("Erro ao inserir usuário");
    } else {
      res.status(201).send({ id: results.insertId, ...usuario });
    }
  });
});


// CRUD APIs for 'inventarios'
app.get("/inventarios/produtos", (req, res) => {
  const query = `
    SELECT p.id, p.nome, p.volume, p.codigo_barras, p.marca, c.nome AS categoria_nome, f.nome_fantasia AS fornecedor_nome
    FROM produtos p
    JOIN categoria c ON p.categoria_id = c.id
    JOIN fornecedor f ON p.fornecedor_id = f.id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      res.status(500).send("Erro ao buscar produtos");
    } else {
      res.json(results);
    }
  });
});

// Get a single product by ID
app.get("/inventarios/produtos/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM produtos WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Produto não encontrado");
    }
  });
});

// Rota para salvar o inventário em lote
app.post("/inventarios/lote", (req, res) => {
  const inventarioData = req.body; // Array de dados do inventário

  const query = `
    INSERT INTO inventario (produto_id, usuario_id, quantidade, data_inventario, observacao)
    VALUES ?
  `;

  const values = inventarioData.map((item) => [
    item.produto_id,
    item.usuario_id,
    item.quantidade,
    item.data, // Certifique-se de que 'data' está no formato correto (YYYY-MM-DD HH:MM:SS)
    item.observacao,
  ]);

  connection.query(query, [values], (err, result) => {
    if (err) {
      console.error("Erro ao inserir inventário:", err);
      res.status(500).send("Erro ao inserir inventário");
    } else {
      res.status(201).json({ message: "Inventário inserido com sucesso" });
    }
  });
});


// Update inventory stock balance
app.put("/inventarios/saldo-estoque", (req, res) => {
  const { produto_id, quantidade } = req.body;

  const query = `
    UPDATE saldo_estoque 
    SET quantidade = quantidade + ?
    WHERE produto_id = ?
  `;

  connection.query(query, [quantidade, produto_id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar saldo de estoque:", err);
      res.status(500).send("Erro ao atualizar saldo de estoque");
      return;
    }

    res.send("Saldo de estoque atualizado com sucesso");
  });
});


const server = app.listen(port, () => {
  // Mantido apenas uma chamada para app.listen
  console.log(`Server running on port ${port}`);
});

function formatDateToMySQL(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

// Dentro da rota
app.post('/pedido-compra', (req, res) => {
  const { solicitante, data_pedido, itens } = req.body;

  if (!solicitante || !data_pedido || !itens || itens.length === 0) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const queryPedido = 'INSERT INTO pedido_compra (solicitante, data) VALUES (?, ?)';
  connection.query(queryPedido, [solicitante, data_pedido], (err, result) => {
    if (err) {
      console.error('Erro ao inserir pedido:', err);
      return res.status(500).json({ error: 'Erro ao salvar pedido.' });
    }

    const pedidoId = result.insertId;

    const itensValues = itens.map((item) => [pedidoId, item.produto_id, item.quantidade]);
    const queryItens = 'INSERT INTO pedido_compra_itens (pedido_id, produto_id, quantidade) VALUES ?';
    connection.query(queryItens, [itensValues], (err) => {
      if (err) {
        console.error('Erro ao inserir itens do pedido:', err);
        return res.status(500).json({ error: 'Erro ao salvar itens do pedido.' });
      }

      res.status(201).json({ message: 'Pedido e itens salvos com sucesso' });
    });
  });
});

app.get("/pedido-compra/relatorio", (req, res) => {
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

  connection.query(query, [dataInicio, dataFim], (err, results) => {
    if (err) {
      console.error("Erro ao buscar relatório de pedidos de compra:", err);
      res.status(500).send("Erro ao buscar relatório de pedidos de compra");
      return;
    }
    res.json(results);
  });
});

// Rota para obter um pedido de compra específico por ID
app.get("/pedido-compra/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM pedido_compra WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedido de compra:", err);
      res.status(500).send("Erro ao buscar pedido de compra");
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Pedido de compra não encontrado");
    }
  });
});


server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    throw err;
  }
});
