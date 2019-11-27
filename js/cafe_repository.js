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
           cafe_Qtd INT,
           ideal_Temperature TEXT,
           userId INTEGER,
           CONSTRAINT estufas_fk_userId FOREIGN KEY (userId)
            REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.run(sql)
    }

    create(estufa_Name, ideal_Water, ideal_Temperature, ideal_Light, userId) {
        return this.dao.run(
            `INSERT INTO estufas (estufa_Name, ideal_Water, ideal_Temperature, ideal_Light, userId)
             VALUES (?, ?, ?, ?, ?)`,
            [estufa_Name, ideal_Water, ideal_Temperature, ideal_Light, userId]
        )
    }

    update(estufa) {
        const { id, estufa_Name, ideal_Water, ideal_Temperature, ideal_Light, userId } = estufa
        return this.dao.run(
            `UPDATE estufas
            SET estfua_Name = ?,
                ideal_Water = ?,
                ideal_Temperatur = ?,
                ideal_Light = ?,
                userId = ?,
            WHERE id = ?`,
            [estufa_Name, ideal_Water, ideal_Temperature, ideal_Light, userId, id]
        )
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM estufas WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM estufas WHERE id = ?`,
            [id])
    }

    getByName(estufaName) {
        return this.dao.get(
            `SELECT * FROM estufas WHERE estufa_Name = ?`,
            [estufaName])
    }

    getAllEstufas(){
        return this.dao.get(`SELECT * FROM estufas`)
    }
}

module.exports = CafeRepository;