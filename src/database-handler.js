// @ts-check
import { DataTypes, Sequelize } from "sequelize";

export class DatabaseHandler {

    /**
     * Cretaes an instance of the DatabaseHandler and connects to the database.
     * 
     * @param {string} host - The host address of the database.
     * @param {string} database - The name of the database.
     * @param {number} port - The port of the database.
     * @param {string} username - The username for the database.
     * @param {string} password - The password for the database.
     */
    constructor(host, database, port, username, password) {
        this.sequelize = new Sequelize(database, username, password, {
            host: host,
            port: port,
            dialect: 'postgres'
        }); 
    }

    /**
     * Checks if a table exists in the database.
     * 
     * @param {string} tableName - The name of the table to check.
     * @returns {Promise<boolean>} - Whether the table exists or not
     */
    async #doesTableExists(tableName) {
        const dbTables = (await this.sequelize.getQueryInterface().showAllTables({ logging: false }));

        return dbTables.includes(tableName);
    }

    /**
     * Returns the columns of a table.
     * 
     * @param {string} tableName - The name of the table to check.
     * @returns {Promise<import("sequelize").ColumnsDescription>} - The columns of the table
     */
    async #getTableColumns(tableName) {
        const queryInterface = this.sequelize.getQueryInterface();
        
        return await queryInterface.describeTable(tableName, { logging: false });
    }

    /**
     * Checks if a table with the given name exists and creates it if not.
     * 
     * **Note:** If the table exists, it will be dropped if the columns differ.
     * 
     * @param {string} tableName - The name of the table to create.
     * @param {Object} columns - The colums of the table to create.
     */
    async createTable(tableName, columns) {
        if (await this.#doesTableExists(tableName)) {
            const oldTable = await this.#getTableColumns(tableName);
            
            if (JSON.stringify(oldTable) !== JSON.stringify(columns)) {
                await this.sequelize.getQueryInterface().dropTable(tableName, { logging: false });
            }
        }

        const attributes = { 
            id: { 
                type: DataTypes.DATE, 
                allowNull: false, 
                primaryKey: true 
            } 
        };
        
        for (const [key, value] of Object.entries(columns)) {
            attributes[key] = {
                type: value,
                allowNull: false,
            };
        }
        
        this.sequelize.define(tableName, attributes, { timestamps: false });
        await this.sequelize.sync({ logging: false });
    }

    /**
     * Inserts data into a table.
     * 
     * @param {string} tableName - Name of the table to insert data into.
     * @param {Object} data - Data to be insert into the table.
     */
    async insertData(tableName, data) {
        await this.sequelize.models[tableName].create(data, { logging: false });
    }

}