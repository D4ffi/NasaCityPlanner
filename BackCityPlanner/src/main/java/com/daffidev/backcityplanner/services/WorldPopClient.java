package com.daffidev.backcityplanner.services;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WorldPopClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Logger logger = LoggerFactory.getLogger(WorldPopClient.class);

    private static final String BASE_URL = "https://www.worldpop.org/rest/data/pop/WPGP";
    private static final String POPULATION_DENSITY_URL = "https://www.worldpop.org/rest/data/pop_density/pd_ic_1km";

    public WorldPopClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(requestFactory);
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Fetches WorldPop population data for a given ISO3 country code.
     *
     * Contract:
     * - Input: iso3 (non-null, e.g. "MEX")
     * - Output: parsed JSON as Jackson JsonNode on success
     * - Errors: throws RuntimeException for network/parse errors, rethrows HttpClientErrorException for 4xx/5xx
     */
    public JsonNode fetchPopulationByIso3(String iso3) {
        if (iso3 == null || iso3.isBlank()) {
            throw new IllegalArgumentException("iso3 must be provided");
        }

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("iso3", iso3)
                .toUriString();

        try {
            ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                logger.debug("Solicitud exitosa");
                return objectMapper.readTree(resp.getBody());
            } else {
                logger.warn("WorldPop returned non-2xx status: {}", resp.getStatusCode());
                return null;
            }
        } catch (HttpClientErrorException e) {
            // Propagate so callers can handle 4xx/5xx specially if desired
            logger.error("WorldPop HTTP error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching WorldPop data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch WorldPop data", e);
        }
    }

    /** Convenience method that returns raw JSON as string (or null). */
    public String fetchPopulationByIso3AsString(String iso3) {
        JsonNode node = fetchPopulationByIso3(iso3);
        return node == null ? null : node.toString();
    }

    /**
     * Fetches WorldPop population density data with image URLs for a given ISO3 country code.
     *
     * Contract:
     * - Input: iso3 (non-null, e.g. "MEX")
     * - Output: parsed JSON as Jackson JsonNode containing popyear and url_image fields
     * - Errors: throws RuntimeException for network/parse errors, rethrows HttpClientErrorException for 4xx/5xx
     */
    public JsonNode fetchPopulationDensityByIso3(String iso3) {
        if (iso3 == null || iso3.isBlank()) {
            throw new IllegalArgumentException("iso3 must be provided");
        }

        String url = UriComponentsBuilder.fromHttpUrl(POPULATION_DENSITY_URL)
                .queryParam("iso3", iso3)
                .toUriString();

        try {
            ResponseEntity<String> resp = restTemplate.getForEntity(url, String.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                logger.debug("Population density request successful for iso3: {}", iso3);
                return objectMapper.readTree(resp.getBody());
            } else {
                logger.warn("WorldPop population density returned non-2xx status: {}", resp.getStatusCode());
                return null;
            }
        } catch (HttpClientErrorException e) {
            logger.error("WorldPop population density HTTP error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching WorldPop population density data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch WorldPop population density data", e);
        }
    }
}