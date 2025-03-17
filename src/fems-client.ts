/**
 * Enum representing various API endpoints for the FEMS system.
 */
export enum Endpoint {
  /** Endpoint for retrieving the system state. */
  SystemState = "/rest/channel/_sum/State",

  /** Endpoint for retrieving the battery charging state (State of Charge - SOC). */
  ChargingState = "/rest/channel/_sum/EssSoc",

  /** Endpoint for retrieving the battery active power. */
  BatteryPower = "/rest/channel/_sum/EssActivePower",

  /** Endpoint for retrieving the battery reactive power. */
  BatteryReactivePower = "/rest/channel/_sum/EssReactivePower",

  /** Endpoint for retrieving the grid active power. */
  GridPower = "/rest/channel/_sum/GridActivePower",

  /** Endpoint for retrieving the minimum grid power. */
  GridMinPower = "/rest/channel/_sum/GridMinActivePower",

  /** Endpoint for retrieving the maximum grid power. */
  GridMaxPower = "/rest/channel/_sum/GridMaxActivePower",

  /** Endpoint for retrieving the production active power. */
  ProductionPower = "/rest/channel/_sum/ProductionActivePower",

  /** Endpoint for retrieving the maximum production power. */
  ProductionMaxPower = "/rest/channel/_sum/ProductionMaxActivePower",

  /** Endpoint for retrieving the AC production power. */
  ProductionACPower = "/rest/channel/_sum/ProductionAcActivePower",

  /** Endpoint for retrieving the DC production power. */
  ProductionDCPower = "/rest/channel/_sum/ProductionDcActivePower",

  /** Endpoint for retrieving the total consumption power. */
  ConsumptionPower = "/rest/channel/_sum/ConsumptionActivePower",

  /** Endpoint for retrieving the maximum consumption power. */
  ConsumptionMaxPower = "/rest/channel/_sum/ConsumptionMaxActivePower",
}

/**
 * API client for interacting with the FEMS (Flexible Energy Management System) API.
 */
export class FEMSApiClient {
  private host: string;
  private protocol: string;
  private port: number;
  private authorization: string;

  /**
   * Constructs a new FEMSApiClient instance.
   *
   * @param {string} host - The hostname or IP address of the FEMS server.
   * @param {string} protocol - The protocol to use (e.g., "http" or "https").
   * @param {number} port - The port number of the FEMS server.
   * @param {string} user - The username for authentication.
   * @param {string} password - The password for authentication.
   */
  constructor(
    host: string,
    protocol: string,
    port: number,
    user: string,
    password: string,
  ) {
    this.host = host;
    this.protocol = protocol;
    this.port = port;
    this.authorization = btoa(`${user}:${password}`);
  }

  /**
   * Sends a GET request to the specified FEMS API endpoint.
   *
   * @param {Endpoint} endpoint - The API endpoint to request data from.
   * @returns {Promise<object>} A promise resolving to the JSON response from the API.
   * @throws {Error} If the request fails or returns a non-OK response.
   */
  public async request(endpoint: Endpoint): Promise<object> {
    const response = await fetch(
      `${this.protocol}://${this.host}:${this.port + endpoint}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${this.authorization}`,
        },
      },
    );

    if (!response.ok) throw new Error(`Response Code: ${response.status}`);

    return await response.json();
  }
}
