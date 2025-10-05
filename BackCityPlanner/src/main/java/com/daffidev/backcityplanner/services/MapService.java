package com.daffidev.backcityplanner.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MapService {
    
	private final WorldPopClient worldPopClient;
    private final Logger logger = LoggerFactory.getLogger(MapService.class);
	private final ObjectMapper objectMapper = new ObjectMapper();
	public MapService(WorldPopClient worldPopClient) {
		this.worldPopClient = worldPopClient;
	}

	/**
	 * Retrieves WorldPop population JSON for a given ISO3 code (e.g. "MEX").
	 * Returns the parsed JsonNode or null if not available.
	 */
	public JsonNode getPopulationByIso3(String iso3) {
		return worldPopClient.fetchPopulationByIso3(iso3);
	}

	/**
	 * Convenience helper that returns the nested ['data']['id']['files'] node from WorldPop response.
	 * Returns null if any part of the path is missing.
	 */
	public JsonNode getWorldpopFilesByIso3(String iso3) {
		JsonNode root = worldPopClient.fetchPopulationByIso3(iso3);
		if (root == null) return null;

		JsonNode dataNode = root.path("data");
		if (dataNode.isMissingNode() || dataNode.isNull()) {
			logger.error("Respuesta WorldPop sin campo 'data'");
			return null;
		}

		ArrayNode resultArray = objectMapper.createArrayNode();

		if (dataNode.isArray()) {
			for (JsonNode item : dataNode) {
				JsonNode filesNode = item.path("files");
				if (filesNode.isArray()) {
					for (JsonNode f : filesNode) {
						resultArray.add(f.asText());
					}
				}
			}
		} else {
			// data is an object
			JsonNode filesNode = dataNode.path("files");
			if (filesNode.isArray()) {
				for (JsonNode f : filesNode) {
					resultArray.add(f.asText());
				}
			}
		}

		if (resultArray.isEmpty()) {
			logger.error("No se obtuvieron archivos");
			return null;
		}
		logger.debug("Solicitud exitosa, archivos encontrados: {}", resultArray.size());
		return resultArray;
	}
}
