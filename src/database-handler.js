// @ts-check
import { DataTypes, Sequelize } from 'sequelize';
import { Logger } from './logger.js';


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
     * Checks if a table with the given name exists and creates it if not.
     * 
     * **Note:** If the table exists, it will be dropped if the columns differ.
     * 
     * @param {string} table - The name of the table to create.
     * @param {Object} model - The colums of the table to create.
     */
    async createTable(table, model) {
        const qInterface = this.sequelize.getQueryInterface();
        const silentArg = { logging: false };

        /* Checks if the table in the Database is equal to the passed
           model. If not, the table in the DB will be dropped and a 
           new will be created according to the passed model */
        if (await qInterface.tableExists(table, silentArg)) {
            const dbTable = await qInterface.describeTable(table, silentArg);
            const mistmatches = Object.entries(dbTable).filter(
                attribute => !(
                    attribute[0] in model && 
                    model[attribute[0]]['key'] === attribute[1]['type'] || 
                    attribute[0] === 'id'
                )
            );

        
            if (mistmatches.length || Object.getOwnPropertyNames(dbTable).length -1 !== Object.getOwnPropertyNames(model).length) {
                Logger.warning('A new Table Structure was detected, the old table will be dropped');
                qInterface.dropTable(table, silentArg);
            }
        }

        /* Actual model which will be passed to sequelize */
        const attributes = { 
            id: { 
                type: DataTypes.DATE, 
                allowNull: false, 
                primaryKey: true 
            } 
        };

        for (const [key, value] of Object.entries(model)) {
            attributes[key] = {
                type: value,
                allowNull: false,
            };
        }
        
        this.sequelize.define(table, attributes, { timestamps: false });
        await this.sequelize.sync(silentArg);
    }

    /**
     * Inserts data into a table.
     * 
     * @param {string} table - Name of the table to insert data into.
     * @param {Object} data - Data to be insert into the table.
     */
    async insertData(table, data) {
        data['id'] = new Date().getTime();

        await this.sequelize.models[table].create(data, { logging: false });
    }

}