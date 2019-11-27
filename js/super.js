// main.js

// project -> user 
// task - > account 

const Promise = require('bluebird')
const AppDAO = require('./dao')
const UserRepository = require('./user_repository')
const AccountRepository = require('./account_repository');
const EstufaRepository = require('./estufa_repository')
var restify = require("restify");
var corsMiddleware = require("restify-cors-middleware");
const dao = new AppDAO('./database.sqlite3')
const blogUserData = { name: 'Admin' }
const userRepo = new UserRepository(dao)
const accountRepo = new AccountRepository(dao)
const estufaRepo = new EstufaRepository(dao)


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

async function createTableEstufa(req, res, next) {
    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");
    let userId = null;
    let ghname = req.body.estufa_Name;
    let aguaIdeal = req.body.ideal_Water;
    let luzIdeal = req.body.ideal_Light;
    let tempIdeal = req.body.ideal_Temperature;
    await userRepo.createTable()
        .then(() => estufaRepo.createTable())
        .then(() => userRepo.create(blogUserData.name))
        .then((data) => {
            userId = data.id
            var estufas = [ // estufas dos usuarios
                {
                    estufa_Name: ghname,
                    ideal_Water: aguaIdeal,
                    ideal_Light: luzIdeal,
                    ideal_Temperature: tempIdeal,
                    userId
                }
            ]
            return Promise.all(estufas.map((estufa) => {
                var { estufa_Name, ideal_Water, ideal_Light, ideal_Temperature, userId } = estufa
                return estufaRepo.create(estufa_Name, ideal_Water, ideal_Light, ideal_Temperature, userId)
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

async function getAllEstufas(req, res, next){
    res.setHeader("content-type", "application/json");
    res.charSet("UTF-8");

    let estufa_Name = req.params.estufa_Name;

    let data = await estufaRepo.getAllEstufas()
        .then((estufas) => {
            // todo ver retorno do banco
    
            console.log(estufas);
            return estufas;
        })
    res.json(data);
    next();
}


var server = restify.createServer({ name: "Estufa Automatizada" });
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

const cors = corsMiddleware({
    origins: ["*"],
    allowHeaders: ["API-Token"],
    exposeHeaders: ["API-Token-Expiry"]
});

server.pre(cors.preflight);
server.use(cors.actual);

var estufaPoint = "/estufa";

server.post(`${estufaPoint}/inserir`, createTable);
server.post(`${estufaPoint}/inserir-estufa`, createTableEstufa);

server.get(`${estufaPoint}/account/pesquisa/by-id/:userId`, getUserById);
server.get(`${estufaPoint}/account/pesquisa/by-acname/:acName`, getUserByAcName);

server.get(`${estufaPoint}/estufas/listar-todas/`, getAllEstufas);

var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function () {
    console.log("%s rodando", server.name);
    console.log("Escutando na porta 5000");
})
