  
//Importando a biblioteca do Restify
var restify = require("restify");
var mysql = require("mysql");
var corsMiddleware = require("restify-cors-middleware");
var sleep = require('system-sleep');

/*
	Criando objeto com as credenciais
	de conexão com o BD
*/
var con = {
  host: "localhost",
  user: "root",
  password: "",
  database: "ec021"
};

// FUNÇÕES ADICIONAIS

let verificaVencidos = (rows, buscaVencidos) => {

  let dataHoje = new Date();

  dataHoje.setHours(0,0,0,0);

  if(buscaVencidos == 'true') return rows;
  
  else {

    let aux = [];

    rows.forEach(element => {

      let dia = (element.validade.split("/"))[0];
      // subtrair 1 do mês porque o JS conta os meses de 0 a 11
      let mes = ((element.validade.split("/"))[1]) -1 ;
      let ano = (element.validade.split("/"))[2];

      let dateElement = new Date(ano, mes, dia);

      if (dateElement >= dataHoje) aux.push(element); 

    });

    return aux;
  
  }
}

/*
	Criando nossas funções do CRUD.
*/
function inserir(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /**
   * Montando um objeto toddy com
   * os dados que vieram do body da request
   */
  var toddy = {
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery =
    "INSERT INTO toddy (lote, conteudo, validade)" +
    " VALUES ('" +
    toddy.lote +
    "', " +
    toddy.conteudo +
    ", '" +
    toddy.validade +
    "');";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      res.json(rows); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

function atualizar(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /**
   * Montando um objeto toddy com
   * os dados que vieram do body da request
   */
  var toddy = {
    id: req.body.id,
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery =
    "UPDATE toddy SET lote = '" +
    toddy.lote +
    "', conteudo = " +
    toddy.conteudo +
    ", validade = '" +
    toddy.validade +
    "'" +
    " WHERE id = " +
    toddy.id +
    ";";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      res.json(rows); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

function listar(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery = "SELECT id, lote, conteudo, validade FROM toddy;";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      res.json(rows); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

function buscarPorId(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /** Recebendo ID como parâmetro na URL */
  var id = req.query.id;

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery =
    "SELECT id, lote, conteudo, validade FROM toddy" +
    " WHERE id = " +
    id +
    ";";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      res.json(rows); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

function buscarVencidos(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery = "SELECT id, lote, conteudo, validade FROM toddy;";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      var dataHoje = new Date(); //Variável para armazenar a data corrente
      var vencidos = []; //Vetor para armazenar os vencidos

      for (var i = 0; i < rows.length; i++) {
        //Percorrendo todas as rows
        var toddy = rows[i];

        // Convertendo a string em data
        var parts = toddy.validade.split("/"); //Separando a data em um vetor DD MM AAAA
        // Atenção ao mês (parts[1]); JavaScript conta os meses a partir do 0:
        // Janeiro - 0, Fevereiro - 1, etc.
        var dataToddy = new Date(parts[2], parts[1] - 1, parts[0]);

        if (dataToddy < dataHoje) {
          //Se a data do produto for menor que a data de hoje, está vencido
          vencidos.push(toddy); //Adiciona elemento no vetor
        }
      }
      res.json(vencidos); //Retornamos as linhas com os produtos vencidos
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

function buscarLotes(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery = "SELECT DISTINCT lote FROM toddy;";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      res.json(rows); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

function buscarPorLote(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /** Recebendo ID como parâmetro na URL */
  var lote = req.query.lote;
  var buscaVencidos = req.query.vencidos;

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery = "SELECT id, lote, conteudo, validade FROM toddy WHERE lote = '"+lote+"'";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      var rnd = Math.random()*1000;
      rnd = parseInt(rnd);
      console.log("Busca para o lote " + lote + " demora " + rnd + "ms");
      sleep(rnd); //Gerando um atraso de até 1s para simular atraso do servidor
      
      let newResp = [];

      newResp = verificaVencidos(rows, buscaVencidos);

      res.json(newResp); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

function excluir(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  var id = req.body.id;

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery = "DELETE FROM toddy WHERE id = " + id + ";";

  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      res.json(rows); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}

//Configurando servidor
var server = restify.createServer({ name: "Prática Final" });

/**
 * Utilizando o bodyParser para
 * converter o body da request em
 * um jSON
 * */
server.use(restify.plugins.bodyParser());

/**
 * Utilizando o queryParser para
 * permitir que métodos GET passem
 * parâmetros na URL
 */
server.use(restify.plugins.queryParser());

/**
 * Incluindo configuração do CORS
 */
const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["API-Token"],
  exposeHeaders: ["API-Token-Expiry"]
});

server.pre(cors.preflight);
server.use(cors.actual);

/*
	Definindo endpoints (ou rotas) da minha aplicação.
*/
var toddyPoint = "/toddy"; //Usaremos esta variável para padronizar as URI's

server.post(toddyPoint + "/inserir", inserir);
server.post(toddyPoint + "/atualizar", atualizar);
server.get(toddyPoint + "/listar", listar);
server.get(toddyPoint + "/buscarPorId", buscarPorId);
server.get(toddyPoint + "/buscarVencidos", buscarVencidos);
server.get(toddyPoint + "/buscarLotes", buscarLotes);
server.get(toddyPoint + "/buscarPorLote", buscarPorLote);
server.post(toddyPoint + "/excluir", excluir);

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function() {
  console.log("%s rodando", server.name);
});