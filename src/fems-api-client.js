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
     * @throws Will throw an error if the response is not OK or the returned content is undefined
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

        if (!response.ok) {
            throw new Error(`Received code: ${response.status}`);
        }

        const json = await response.json();

        if (json === undefined) {
            throw new Error('Payload is undefined');
        }

        return json;
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
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current system state.
     */
    async getSystemState() {
        try {
            return (await this.#request('/rest/channel/_sum/State')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current battery state of charge in percent.
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current battery 
     *                            state of charge.
     */
    async getBatteryChargingState() {
        try {
            return (await this.#request('/rest/channel/_sum/EssSoc')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current power at the battery in watts (W).
     * 
     * The returned valued indicated:
     * - **positive** values: the battery is discharging
     * - **negative** values: the battery is charging
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current power
     */
    async getBatteryPower() {      
        try {
            return (await this.#request('/rest/channel/_sum/EssActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current reactive power at the battery in volt-ampere reactive (VAR).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current reactive power.
     */
    async getBatteryReactivePower() {
        try {
            return (await this.#request('/rest/channel/_sum/EssReactivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current power at the grid connection in Watts (W).
     * 
     * The returned value indicates:
     * - **negative** values: the power is sold to the grid
     * - **positive** values: the power is bought from the grid
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getGridPower() {
        try {
            return (await this.#request('/rest/channel/_sum/GridActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the lowest power ever measured at the grid connection in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the lowest power.
     */
    async getGridMinPower() {
        try {
            return (await this.#request('/rest/channel/_sum/GridMinActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the highest power ever measured at the grid connection in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the highest power.
     */
    async getGridMaxPower() {
        try {
            return (await this.#request('/rest/channel/_sum/GridMaxActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current power which is produced by the photovoltaic system in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getProductionPower() {
        try {
            return (await this.#request('/rest/channel/_sum/ProductionActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the hightest power ever produced by the photovoltaic system in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the highest power.
     */
    async getProductionMaxPower() {
        try {
            return (await this.#request('/rest/channel/_sum/ProductionMaxActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current production power at the AC-Side of the Inverter in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getProductionACPower() {
        try {
            return (await this.#request('/rest/channel/_sum/ProductionAcActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current production power at the DC-Side of the Inverter in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getProductionDCPower() {
        try {
            return (await this.#request('/rest/channel/_sum/ProductionDcActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the current consumption power in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the current power.
     */
    async getConsumptionPower() {
        try {
            return (await this.#request('/rest/channel/_sum/ConsumptionActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns the highest consumption power ever measured in Watts (W).
     * 
     * @throws Will throw an error if the response is not OK or the returned content is undefined
     * @returns {Promise<number>} A promise that resolves to the highest power.
     */
    async getCosumptionMaxPower() {
        try {
            return (await this.#request('/rest/channel/_sum/ConsumptionMaxActivePower')).value;
        } catch (error) {
            throw error;
        }
    }

}
