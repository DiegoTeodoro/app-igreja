const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

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
app.get("/igrejas/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM igreja WHERE codigo = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching igreja:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results[0]);
    }
  );
});

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
  delete igreja.codigo; // Remover a coluna 'codigo' antes de inserir
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
  delete igreja.codigo; // Garantir que a coluna 'codigo' não está sendo removida
  connection.query(
    "UPDATE igreja SET ? WHERE codigo = ?",
    [igreja, id],
    (err, results) => {
      if (err) {
        console.error("Error updating igreja:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    }
  );
});

app.delete("/igrejas/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM igreja WHERE codigo = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting igreja:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(results);
    }
  );
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

app.post("/notas-fiscais", (req, res) => {
  const notaFiscal = req.body;
  const itensNotaFiscal = notaFiscal.itens; // Extrai os itens da nota fiscal

  // Converta a data_emissao para o formato 'YYYY-MM-DD'
  let dataEmissao = new Date(notaFiscal.data_emissao)
    .toISOString()
    .slice(0, 10);

  // Calcular o valor total da nota somando os itens
  const valorTotalProdutos = itensNotaFiscal.reduce(
    (acc, item) => acc + (item.valor_total || 0),
    0
  );
  const valorTotalNota =
    valorTotalProdutos + (notaFiscal.outros || 0) - (notaFiscal.desconto || 0);

  // Query para inserir a nota fiscal
  const notaFiscalQuery =
    "INSERT INTO nota_fiscal (numero_nota, serie, chave_acesso, fornecedor_id, data_emissao, valor_total, valor_total_produtos, valor_total_nota, desconto, outros, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const notaFiscalParams = [
    notaFiscal.numero_nota,
    notaFiscal.serie,
    notaFiscal.chave_acesso,
    notaFiscal.fornecedor_id,
    dataEmissao,
    valorTotalNota, // Valor total da nota
    valorTotalProdutos, // Valor total dos produtos
    valorTotalNota,
    notaFiscal.desconto || 0,
    notaFiscal.outros || 0,
    notaFiscal.observacoes || "",
  ];

  // Executa a query de inserção para a nota fiscal
  connection.query(notaFiscalQuery, notaFiscalParams, (err, result) => {
    if (err) {
      console.error("Erro ao inserir nota fiscal:", err);
      res.status(500).send("Erro ao inserir nota fiscal");
      return;
    }

    const notaFiscalId = result.insertId; // ID da nota fiscal recém-inserida

    const itensQuery =
  "INSERT INTO itens_nota_fiscal (nota_fiscal_id, produto_id, quantidade, valor_unitario) VALUES ?";
const itensParams = itensNotaFiscal.map((item) => [
  notaFiscalId,
  item.produto_id,
  item.quantidade,
  item.valor_unitario,
]);
app.put('/api/saldo_estoque/:produto_id', (req, res) => {
  const produto_id = req.params.produto_id;
  const quantidade = req.body.quantidade;

  // Reduza a quantidade no saldo de estoque
  db.query(`UPDATE saldo_estoque SET quantidade = quantidade - ? WHERE produto_id = ?`, [quantidade, produto_id], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// Rota para registrar um pedido


    // Executa a query de inserção para os itens
    connection.query(itensQuery, [itensParams], (err) => {
      if (err) {
        console.error("Erro ao inserir itens da nota fiscal:", err);
        res.status(500).send("Erro ao inserir itens da nota fiscal");
        return;
      }

      res.status(201).json({
        message: 'Nota fiscal salva com sucesso',
        notaFiscalId: notaFiscalId,
    });
  });
});
});

// Rota para buscar todos os registros de saldo_estoque
app.get("/saldo-estoque", (req, res) => {
  const query = `
    SELECT se.*, p.nome AS produto_nome
    FROM saldo_estoque se
    JOIN produtos p ON se.produto_id = p.id
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

// Rota para atualizar apenas a quantidade no saldo de estoque
app.put("/saldo-estoque/:id", (req, res) => {
  const id = req.params.id;
  const { quantidade } = req.body;  // Só estamos recebendo a quantidade

  // Validação: Verificar se a quantidade foi fornecida
  if (quantidade == null) {
    res.status(400).send("Quantidade é obrigatória.");
    return;
  }

  // Query para atualizar apenas a quantidade e a data de atualização
  const query = `
    UPDATE saldo_estoque 
    SET quantidade = ?, updated_at = NOW()  -- Apenas atualizando a quantidade
    WHERE id = ?
  `;
  const params = [quantidade, id];  // Atualizamos apenas a quantidade

  connection.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar saldo de estoque:", err);
      res.status(500).send("Erro ao atualizar saldo de estoque.");
      return;
    }

    res.send("Quantidade de saldo de estoque atualizada com sucesso.");
  });
});
// Rota para buscar todos os pedidos
app.get("/pedidos", (req, res) => {
  const query = `
    SELECT p.id, p.igreja_id, i.nome AS igreja_nome, p.data_pedido, p.status, p.valor_total, p.recebedor
    FROM pedidos p
    JOIN igreja i ON p.igreja_id = i.codigo;
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedidos:", err);
      res.status(500).send("Erro ao buscar pedidos");
    } else {
      res.json(results);  // Retorna os pedidos no formato JSON
    }
  });
});


// Rota para buscar um pedido por código
app.get("/pedidos/:id", (req, res) => {
  const pedidoId = req.params.id;
  const query = `
    SELECT p.*, i.nome AS igreja_nome 
    FROM pedidos p
    JOIN igreja i ON p.igreja_id = i.codigo
    WHERE p.id = ?
  `;
  connection.query(query, [pedidoId], (err, results) => {
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

app.post("/pedidos", (req, res) => {
  const pedido = req.body;
  const itensPedido = pedido.pedido_itens;

  // Inserir o pedido
  const pedidoQuery = `
    INSERT INTO pedidos (igreja_id, data_pedido, status, valor_total, recebedor)
    VALUES (?, ?, ?, ?, ?)
  `;
  const pedidoParams = [pedido.igreja_id, pedido.data_pedido, pedido.status, pedido.valor_total, pedido.recebedor];

  connection.query(pedidoQuery, pedidoParams, (err, result) => {
    if (err) {
      console.error("Erro ao inserir o pedido:", err);
      res.status(500).send("Erro ao inserir o pedido");
      return;
    }

    const pedidoId = result.insertId; // ID do pedido recém-inserido

    // Inserir os itens do pedido
    const itensQuery = `
    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, valor_unitario)
    VALUES ?
  `;
  const itensParams = itensPedido.map(item => [
    pedidoId,
    item.produto_id,
    item.quantidade,
    item.valor_unitario
  ]);

    connection.query(itensQuery, [itensParams], (err) => {
      if (err) {
        console.error("Erro ao inserir itens do pedido:", err);
        res.status(500).send("Erro ao inserir itens do pedido");
        return;
      }

      res.status(201).send("Pedido e itens salvos com sucesso");
    });
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
function formatDateToMySQL(date){
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2); // mês começa em 0
  const day = (`0${d.getDate()}`).slice(-2);
  const hours = (`0${d.getHours()}`).slice(-2);
  const minutes = (`0${d.getMinutes()}`).slice(-2);
  const seconds = (`0${d.getSeconds()}`).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// No código de inserção do pedido
app.post("/pedidos", (req, res) => {
  const pedido = req.body;

  // Converte a data do pedido para o formato MySQL
  const dataPedidoMySQL = formatDateToMySQL(pedido.data_pedido);

  const query = `
    INSERT INTO pedidos (igreja_id, data_pedido, status, valor_total, recebedor)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const params = [pedido.igreja_id, dataPedidoMySQL, pedido.status, pedido.valor_total, pedido.recebedor];

  connection.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao inserir o pedido:", err);
      res.status(500).send("Erro ao inserir o pedido");
    } else {
      res.status(201).send("Pedido salvo com sucesso");
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

// CRUD APIs for 'usuario'

// Get all users
app.get("/usuarios", (req, res) => {
  connection.query("SELECT * FROM usuario", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});

// Get a single user by ID
app.get("/usuarios/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM usuario WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("User not found");
    }
  });
});

// Create a new user
app.post("/usuarios", (req, res) => {
  const usuario = req.body;
  const query = "INSERT INTO usuario SET ?";
  connection.query(query, usuario, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ id: results.insertId, ...usuario });
    }
  });
});


// Update an existing user by ID
app.put("/usuarios/:id", (req, res) => {
  const id = req.params.id;
  const usuario = req.body;
  const query = "UPDATE usuario SET ? WHERE id = ?";
  connection.query(query, [usuario, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("User updated successfully");
    }
  });
});

// Delete a user by ID
app.delete("/usuarios/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM usuario WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("User deleted successfully");
    }
  });
});
app.post("/usuarios/login", (req, res) => {
  const { login, senha } = req.body;
  const query = "SELECT * FROM usuario WHERE login = ? AND senha = ?";
  
  connection.query(query, [login, senha], (err, results) => {
    if (err) {
      res.status(500).send("Erro no servidor");
    } else if (results.length > 0) {
      res.send({ valid: true });  // Retorna valid=true se o login e senha forem corretos
    } else {
      res.send({ valid: false }); // Retorna valid=false se o login e senha forem incorretos
    }
  });
});

// CRUD APIs for 'empresa'

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

const server = app.listen(port, () => {
  // Mantido apenas uma chamada para app.listen
  console.log(`Server running on port ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    throw err;
  }
});
