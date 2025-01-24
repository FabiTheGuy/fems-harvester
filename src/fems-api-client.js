// @ts-check


export class FemsApiClient {

    /**
     * Creates an instance of the FemsApiClient.
     * 
     * @param {string} host - The host address of the FEMS API.
     * @param {string} protocol - The protocol to use in the requests.
     * @param {number} port - The port number to connect to.
     * @param {string} username - The username for basic authentication.
     * @param {string} password - The password for basic authentication.
     */
    constructor(host, protocol, port, username, password) {
        this.host = host;
        this.protocol = protocol;
        this.port = port;
        this.auth = btoa(`${username}:${password}`);
    }

    /**
     * Makes a request to the FEMS API.
     * 
     * @param {string} endpoint - The endpoint to request.
     * @returns {Promise<any>} A promise that resolves to the response from the FEMS API.
     */
    async #request(endpoint) {
        const requestEndpoint = `${this.protocol}://${this.host}:${this.port}${endpoint}`; 

        const response = await fetch(requestEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${this.auth}`,
            }
        });

        if (response.status != 200) {
            throw new Error(`Request "${endpoint}"`);
        }

        return await response.json();
    }

    /**
     * Returns the current system state.
     * 
     * The returned value indicates the system state:
     * - 0: OK
     * - 1: Info
     * - 2: Warning
     * - 3: Fault
     * 
     * @returns {Promise<number>} A promise that resolves to the current system state.
     */
    async getSystemState() {
        return (await this.#request('/rest/channel/_sum/State')).value;
    }

    /**
     * Returns the current battery state of charge in percent.
     * 
     * @returns {Promise<number>} A promise that resolves to the current battery 
     *                            state of charge.
     */
    async getBatteryChargingState() {
        return (await this.#request('/rest/channel/_sum/EssSoc')).value;
    }

    /**
     * Returns the current power at the battery in watts (W).
     * 
     * The returned valued indicated:
     * - **positive** values: the battery is discharging
     * - **negative** values: the battery is charging
     * 
     * @returns {Promise<number>} A promise that resolves to the current power
     */
    async getBatteryPower() {      
        return (await this.#request('/rest/channel/_sum/EssActivePower')).value;
    }

    /**
     * Returns the current reactive power at the battery in volt-ampere reactive (VAR).
     * 
     * @returns {Promise<number>} A promise that resolves to the current reactive power.
     */
    async getBatteryReactivePower() {
        return (await this.#request('/rest/channel/_sum/EssReactivePower')).value;
    }

    /**
     * Returns the current power at the grid connection in Watts (W).
     * 
     * The returned value indicates:
     * - **negative** values: the power is sold to the grid
     * - **positive** values: the power is bought from the grid
     * 
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getGridPower() {
        return (await this.#request('/rest/channel/_sum/GridActivePower')).value;
    }

    /**
     * Returns the lowest power ever measured at the grid connection in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the lowest power.
     */
    async getGridMinPower() {
        return (await this.#request('/rest/channel/_sum/GridMinActivePower')).value;
    }

    /**
     * Returns the highest power ever measured at the grid connection in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the highest power.
     */
    async getGridMaxPower() {
        return (await this.#request('/rest/channel/_sum/GridMaxActivePower')).value;
    }

    /**
     * Returns the current power which is produced by the photovoltaic system in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getProductionPower() {
        return (await this.#request('/rest/channel/_sum/ProductionActivePower')).value;
    }

    /**
     * Returns the hightest power ever produced by the photovoltaic system in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the highest power.
     */
    async getProductionMaxPower() {
        return (await this.#request('/rest/channel/_sum/ProductionMaxActivePower')).value;
    }

    /**
     * Returns the current production power at the AC-Side of the Inverter in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getProductionACPower() {
        return (await this.#request('/rest/channel/_sum/ProductionAcActivePower')).value;
    }

    /**
     * Returns the current production power at the DC-Side of the Inverter in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getProductionDCPower() {
        return (await this.#request('/rest/channel/_sum/ProductionDcActivePower')).value;
    }

    /**
     * Returns the current consumption power in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getConsumptionPower() {
        return (await this.#request('/rest/channel/_sum/ConsumptionActivePower')).value;
    }

    /**
     * Returns the highest consumption power ever measured in Watts (W).
     * 
     * @returns {Promise<number>} A promise that resolves to the highest power.
     */
    async getCosumptionMaxPower() {
        return (await this.#request('/rest/channel/_sum/ConsumptionMaxActivePower')).value;
    }

}