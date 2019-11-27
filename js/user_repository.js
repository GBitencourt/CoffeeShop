// project_repository.js

// usuarios

class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT)`
        return this.dao.run(sql)
    }

    create(name) {
        return this.dao.run(
            'INSERT INTO users (name) VALUES (?)', // '?' -> This is known as a parameterized query statement which will clense the inputs to minimize SQL injection risks.
            [name])
    }

    update(user) {
        const { id, name } = user
        return this.dao.run(
            `UPDATE users SET name = ? WHERE id = ?`,
            [name, id]
        )
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM users WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM users WHERE id = ?`,
            [id])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM users`)
    }

    getAccounts(userId) {
        return this.dao.all(
            `SELECT * FROM accounts WHERE userId = ?`,
            [userId])
    }

}

module.exports = UserRepository; 