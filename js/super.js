// main.js

// project -> user 
// task - > account 

const Promise = require('bluebird')
const AppDAO = require('./dao')
const UserRepository = require('./user_repository')
const AccountRepository = require('./account_repository');
const CafeRepository = require('./cafe_repository')
var restify = require("restify");
var corsMiddleware = require("restify-cors-middleware");
const dao = new AppDAO('./database.sqlite3')
const blogUserData = { name: 'Admin' }
const userRepo = new UserRepository(dao)
const accountRepo = new AccountRepository(dao)
const cafeRepo = new CafeRepository(dao)


async function getUser(req, res, next) {

    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");

    let userId = parseInt(req.params.userId);
    let user = await userRepo.getById(userId)
        .then((user) => {
            console.log(`\nRetreived user from database`);
            console.log(`user id = ${user.id}`);
            console.log(`user name = ${user.name}`);
            return userRepo.getAccounts(user.id);
        });

    console.log(user)
    res.json(user)
    next()

}

async function getUserById(req, res, next) {

    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");

    console.log('\nRetrieved user accounts database')

    let userId = parseInt(req.params.userId);

    let data = await accountRepo.getById(userId)
        .then((user) => {
            return {
                "Nome": user.acName,
                "Senha": user.password,
                "Id": user.userId,
            }
        })
    res.json(data);
    next();
}

async function createTable(req, res, next) {
    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");
    let userId = null;
    let username = req.body.username;
    let password = req.body.password;
    await userRepo.createTable()
        .then(() => accountRepo.createTable())
        .then(() => userRepo.create(blogUserData.name))
        .then((data) => {
            userId = data.id
            var accounts = [ // contas dos usuarios
                {
                    acName: username,
                    password: password,
                    userId
                }
            ]
            return Promise.all(accounts.map((account) => {
                var { acName, password, userId } = account
                return accountRepo.create(acName, password, userId)
            }))
        })
        .catch((err) => {
            console.log('Error: ')
            console.log(JSON.stringify(err))
        })

    next();
}

async function createTableCafe(req, res, next) {
    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");
    let cNome = req.body.cafe_Name;
    let cPreco = req.body.cafe_Preco;
    let cQtd = req.body.cafe_Qtd;
    await userRepo.createTable()
        .then(() => cafeRepo.createTable())
        .then(() => userRepo.create(blogUserData.name))
        .then((data) => {
            userId = data.id
            var cafes = [ // cafes dos usuarios
                {
                    cafe_Name: cNome,
                    cafe_Preco: cPreco,
                    cafe_Qtd: cQtd,
                    userId
                }
            ]
            return Promise.all(cafes.map((cafe) => {
                var { cafe_Name, cafe_Preco, cafe_Qtd, userId} = cafe
                return cafeRepo.create(cafe_Name, cafe_Preco, cafe_Qtd, userId)
            }))
        })
        .catch((err) => {
            console.log('Error: ')
            console.log(JSON.stringify(err))
        })

    next();
}

async function getUserByAcName(req, res, next) {
    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");

    let acName = req.params.acName;

    let data = await accountRepo.getByAcName(acName)
        .then((user) => {
            let respObj =
                (user) ? {
                    username: user.acName,
                    password: user.password
                } : null;
            return respObj;
        })
    res.json(data);
    next();
}

async function getAllCafes(req, res, next){
    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");

    let cafe_Name = req.params.cafe_Name;

    let data = await cafeRepo.getAllCafes()
        .then((cafes) => {
            // todo ver retorno do banco
    
            console.log(cafes);
            return cafes;
        })
    res.json(data);
    next();
}


var server = restify.createServer({ name: "CoffeeShop Express" });
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

const cors = corsMiddleware({
    origins: ["*"],
    allowHeaders: ["API-Token"],
    exposeHeaders: ["API-Token-Expiry"]
});

server.pre(cors.preflight);
server.use(cors.actual);

var cafePoint = "/cafe";

server.post(`${cafePoint}/inserir`, createTable);
server.post(`${cafePoint}/inserir-cafe`, createTableCafe);

server.get(`${cafePoint}/account/pesquisa/by-id/:userId`, getUserById);
server.get(`${cafePoint}/account/pesquisa/by-acname/:acName`, getUserByAcName);

server.get(`${cafePoint}/cafes/listar-todas/`, getAllCafes);

var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function () {
    console.log("%s rodando", server.name);
    console.log("Escutando na porta 5000");
})
