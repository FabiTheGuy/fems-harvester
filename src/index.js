// @ts-check
import { DataTypes } from 'sequelize';
import { FemsApiClient } from './fems-api-client.js';
import { Logger } from './logger.js';


// Environment variables
const FEMS_HOST = process.env.FEMS_HOST || '192.168.180.2';
const FEMS_PORT = Number(process.env.FEMS_PORT || '80');
const FEMS_PROTOCOL = process.env.FEMS_PROTOCOL || 'http';
const FEMS_USER = process.env.FEMS_USER || 'x';
const FEMS_PASS = process.env.FEMS_PASS || 'user';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || '5432');
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'postgres';
const LOG_INTERVAL = Number(process.env.LOG_INTERVAL || '30');
const LOG_MODULES = process.env.LOG_MODULES || 'grid_power,production_power,battery_power';

// Static variables
const femsApiClient = new FemsApiClient(FEMS_HOST, FEMS_PROTOCOL, FEMS_PORT, FEMS_USER, FEMS_PASS);
const apiEndpointFunctions = new Map([
    ['system_state', { fn: femsApiClient.getSystemState, type: DataTypes.INTEGER }],
    ['battery_charging_state', { fn: femsApiClient.getBatteryChargingState, type: DataTypes.INTEGER }],
    ['battery_power', { fn: femsApiClient.getBatteryPower, type: DataTypes.INTEGER }],
    ['battery_reactive_power', { fn: femsApiClient.getBatteryReactivePower, type: DataTypes.INTEGER }],
    ['grid_power', { fn: femsApiClient.getGridPower, type: DataTypes.INTEGER }],
    ['grid_min_power', { fn: femsApiClient.getGridMinPower, type: DataTypes.INTEGER }],
    ['grid_max_power', { fn: femsApiClient.getGridMaxPower, type: DataTypes.INTEGER }],
    ['production_power', { fn: femsApiClient.getProductionPower, type: DataTypes.INTEGER }],
    ['production_max_power', { fn: femsApiClient.getProductionMaxPower, type: DataTypes.INTEGER }],
    ['production_ac_power', { fn: femsApiClient.getProductionACPower, type: DataTypes.INTEGER }],
    ['production_dc_power', { fn: femsApiClient.getProductionDCPower, type: DataTypes.INTEGER }],
    ['consumption_power', { fn: femsApiClient.getConsumptionPower, type: DataTypes.INTEGER }],
    ['consumption_max_power', { fn: femsApiClient.getCosumptionMaxPower, type: DataTypes.INTEGER }],
]);


async function main() {
    // Generates an array of modules according to the LOG_MODULES
    const userModules = LOG_MODULES.split(',').filter(module => {
        if (apiEndpointFunctions.get(module) === undefined) {
            Logger.warning(`Module ${module} is not defined!`);
            return false;
        }
        return true;
    }).map(module => {
        const moduleObj = apiEndpointFunctions.get(module);
        return { name: module, fn: moduleObj?.fn, type: moduleObj?.type };
    });

    // Generates a Model Object for the Database
    const dbModel = Object.fromEntries(userModules.map(
        module => [ module.name, module.type ]
    ));
}


main();
