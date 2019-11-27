// task_repository.js

// contas

class AccountRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          acName TEXT,
          password TEXT,
          userId INTEGER,
          CONSTRAINT accounts_fk_userId FOREIGN KEY (userId)
            REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.run(sql)
    }

    create(acName, password, userId) { // allows me to insert data into the database.
        return this.dao.run( // here i can put all the parameters of my BD
            `INSERT INTO accounts (acName, password, userId) 
            VALUES (?, ?, ?)`,
            [acName, password, userId])
    }

    update(account) {
        const { id, acName, password, userId } = account
        return this.dao.run(
            `UPDATE accounts
        SET acName = ?,
            password = ?,
            userId = ?
        WHERE id = ?`,
            [acName, password, userId, id]
        )
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM accounts WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM accounts WHERE id = ?`,
            [id])
    }

    getByAcName(acName) {
        return this.dao.get(
            `SELECT * FROM accounts WHERE acName = ?`,
            [acName])
    }
}

module.exports = AccountRepository;  