package com.fabitheguy;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

/**
 * Enum representing various API endpoints for the FEMS system.
 */
enum Endpoint {
    SYSTEM_STATE("/rest/channel/_sum/State"),
    CHARGING_STATE("/rest/channel/_sum/EssSoc"),
    BATTERY_POWER("/rest/channel/_sum/EssActivePower"),
    BATTERY_REACTIVE_POWER("/rest/channel/_sum/EssReactivePower"),
    GRID_POWER("/rest/channel/_sum/GridActivePower"),
    GRID_MIN_POWER("/rest/channel/_sum/GridMinActivePower"),
    GRID_MAX_POWER("/rest/channel/_sum/GridMaxActivePower"),
    PRODUCTION_POWER("/rest/channel/_sum/ProductionActivePower"),
    PRODUCTION_POWER_MAX("/rest/channel/_sum/ProductionMaxActivePower"),
    PRODUCTION_AC_POWER("/rest/channel/_sum/ProductionAcActivePower"),
    PRODUCTION_DC_POWER("/rest/channel/_sum/ProductionDcActivePower"),
    CONSUMPTION_POWER("/rest/channel/_sum/ConsumptionActivePower"),
    CONSUMPTION_POWER_MAX("/rest/channel/_sum/ConsumptionMaxActivePower");

    private final String endpoint;

    Endpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    /**
     * Gets the API endpoint as a string.
     *
     * @return the API endpoint
     */
    public String getEndpoint() {
        return this.endpoint;
    }
}

/**
 * FemsApiClient is a client for interacting with the FEMS system API.
 * It supports authentication and requests data from various endpoints.
 */
public class FemsApiClient {

    private final String host, authentication;
    private final int port;

    /**
     * Constructs a FemsApiClient with authentication credentials.
     *
     * @param host     the API server host
     * @param port     the API server port
     * @param username the username for authentication
     * @param password the password for authentication
     */
    public FemsApiClient(String host, int port, String username, String password) {
        this.host = host;
        this.port = port;
        this.authentication = Base64.getEncoder().encodeToString(String.format("%s:%s", username, password).getBytes());
    }

    /**
     * Sends a GET request to the specified API endpoint.
     *
     * @param endpoint the API endpoint to request
     * @return the response as a JSONObject
     * @throws Exception if the request fails
     */
    private JSONObject request(String endpoint) throws Exception {
        try {
            final HttpURLConnection connection = (HttpURLConnection) new URL(String.format("http://%s:%d%s", host, port, endpoint)).openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Authorization", "Basic " + authentication);

            final int status = connection.getResponseCode();

            if (status > 299) {
                throw new Exception(String.format("Status Code: %d", status));
            }

            final BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            final StringBuilder content = new StringBuilder();
            String inputLine;

            while ((inputLine = reader.readLine()) != null) {
                content.append(inputLine);
            }

            return new JSONObject(content.toString());
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Sends a request to a specified endpoint and retrieves an integer value from the response.
     *
     * @param endpoint the API endpoint to request
     * @return the integer value extracted from the response
     * @throws Exception if the request fails
     */
    public int request(Endpoint endpoint) throws Exception {
        final JSONObject response = request(endpoint.getEndpoint());

        return response.getInt("value");
    }
}
