// @ts-check
import { FemsApiClient } from './fems-api-client.js';


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
    ['system_state', femsApiClient.getSystemState],
    ['battery_charging_state', femsApiClient.getBatteryChargingState],
    ['battery_power', femsApiClient.getBatteryPower],
    ['battery_reactive_power', femsApiClient.getBatteryReactivePower],
    ['grid_power', femsApiClient.getGridPower],
    ['grid_min_power', femsApiClient.getGridMinPower],
    ['grid_max_power', femsApiClient.getGridMaxPower],
    ['production_power', femsApiClient.getProductionPower],
    ['production_max_power', femsApiClient.getProductionMaxPower],
    ['production_ac_power', femsApiClient.getProductionACPower],
    ['production_dc_power', femsApiClient.getProductionDCPower],
    ['consumption_power', femsApiClient.getConsumptionPower],
    ['consumption_max_power', femsApiClient.getCosumptionMaxPower],
]);


async function main() {
    // Generates a set of functions that will be used according to the LOG_MODULES 
    // environment variable to harvest data from the FEMS API.
    const userEndpointFunctions = LOG_MODULES.split(',').map(
        module => apiEndpointFunctions.get(module)?.bind(femsApiClient)
    );
}


main();