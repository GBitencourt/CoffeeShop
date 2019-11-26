// Main script
//Bibliotecas
var restify = require("restify");
var mysql = require("mysql");
var corsMiddleware = require("restify-cors-middleware");


/* Criando objeto com as credenciais de conexão com o BD */ 
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  /* Espaço para funções reservar */

  function inserir(req, res, next){
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /**
   * Montando um objeto cafe com
   * os dados que vieram do body da request
   */
  var cafe = {
    qtd: req.body.qtd,
    tipo: req.body.tipo,
    preco: req.body.preco
  };

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();

  /** Escrevendo query que será executada */
  var strQuery =
    "INSERT INTO cafe (qtd, tipo, preco)" +
    " VALUES ('" +
    cafe.qtd +
    "', " +
    cafe.tipo +
    ", '" +
    cafe.preco +
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





























  //Configurando servidor
  var server = restify.createServer({ name: "Coffee Shop" });
  
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
var cafePoint = "/cafe"; //Usaremos esta variável para padronizar as URI's

server.post(cafePoint + "/inserir", inserir);
server.post(cafePoint + "/atualizar", atualizar);
server.get(cafePoint + "/listar", listar);
server.get(cafePoint + "/buscarPorId", buscarPorId);
server.post(cafePoint + "/excluir", excluir);

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function() {
  console.log("%s rodando", server.name);
});