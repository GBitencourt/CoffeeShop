class CafeRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
       CREATE TABLE IF NOT EXISTS cafes (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           cafe_Name TEXT,
           cafe_Preco DOUBLE,
           cafe_Qtd INT,`
        return this.dao.run(sql)
    }

    create(cafe_Name, cafe_Preco, cafe_Qtd) {
        return this.dao.run(
            `INSERT INTO cafes (cafe_Name, cafe_Preco, cafe_Qtd)
             VALUES (?, ?, ?, ?, ?)`,
            [cafe_Name, cafe_Preco, cafe_Qtd]
        )
    }

    update(cafe) {
        const { id, cafe_Name, cafe_Preco, cafe_Qtd } = cafe
        return this.dao.run(
            `UPDATE cafes
            SET cafe_Name = ?,
                cafe_Preco = ?,
            WHERE id = ?`,
            [cafe_Name, cafe_Preco, cafe_Qtd, id]
        )
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM cafes WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM cafes WHERE id = ?`,
            [id])
    }

    getByName(cafeName) {
        return this.dao.get(
            `SELECT * FROM cafes WHERE cafe_Name = ?`,
            [cafeName])
    }

    getAllcafes() {
        return this.dao.get(`SELECT * FROM cafes`)
    }
}

module.exports = CafeRepository;