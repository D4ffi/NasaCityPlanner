package com.daffidev.backcityplanner.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

@Service
public class MapService {

	private final WorldPopClient worldPopClient;

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

		JsonNode files = root.path("data").path("id").path("files");
		if (files.isMissingNode() || files.isNull()) {
			return null;
		}
		return files;
	}
}
