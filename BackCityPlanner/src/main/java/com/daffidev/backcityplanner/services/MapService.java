package com.daffidev.backcityplanner.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Service
public class MapService {

	private static final Logger logger = LoggerFactory.getLogger(MapService.class);

	private final WorldPopClient worldPopClient;
	private final TiffConverter tiffConverter;
	private final RestTemplate restTemplate;

	public MapService(WorldPopClient worldPopClient, TiffConverter tiffConverter) {
		this.worldPopClient = worldPopClient;
		this.tiffConverter = tiffConverter;
		this.restTemplate = new RestTemplate();
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

	/**
	 * Downloads a TIFF file from the given URL and converts it to PNG format.
	 *
	 * @param tiffUrl URL of the TIFF file to download
	 * @return byte array containing PNG image data
	 * @throws IOException if download or conversion fails
	 */
	public byte[] downloadAndConvertTiffToPng(String tiffUrl) throws IOException {
		if (tiffUrl == null || tiffUrl.isBlank()) {
			throw new IllegalArgumentException("TIFF URL cannot be null or empty");
		}

		logger.info("Downloading TIFF from URL: {}", tiffUrl);

		try {
			// Download TIFF file as byte array
			ResponseEntity<byte[]> response = restTemplate.getForEntity(tiffUrl, byte[].class);

			if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
				byte[] tiffData = response.getBody();
				logger.info("Downloaded TIFF file. Size: {} bytes", tiffData.length);

				// Convert to PNG
				return tiffConverter.convertTiffToPng(tiffData);
			} else {
				throw new IOException("Failed to download TIFF file. HTTP status: " + response.getStatusCode());
			}
		} catch (Exception e) {
			logger.error("Error downloading/converting TIFF from URL: {}", tiffUrl, e);
			throw new IOException("Failed to download or convert TIFF file", e);
		}
	}

	/**
	 * Converts a TIFF byte array to PNG format.
	 *
	 * @param tiffData byte array containing TIFF image data
	 * @return byte array containing PNG image data
	 * @throws IOException if conversion fails
	 */
	public byte[] convertTiffToPng(byte[] tiffData) throws IOException {
		return tiffConverter.convertTiffToPng(tiffData);
	}

	/**
	 * Complete workflow: fetches WorldPop data, extracts TIFF URL, downloads and converts to PNG.
	 *
	 * @param iso3 ISO3 country code (e.g., "MEX")
	 * @return byte array containing PNG image data
	 * @throws IOException if any step fails (API call, download, or conversion)
	 */
	public byte[] getPopulationMapAsPng(String iso3) throws IOException {
		// 1. Get WorldPop files metadata
		JsonNode files = getWorldpopFilesByIso3(iso3);

		if (files == null || !files.isArray() || files.size() == 0) {
			throw new IOException("No files found for ISO3: " + iso3);
		}

		// 2. Extract TIFF URL from first file (assuming field name is "pth")
		JsonNode firstFile = files.get(0);
		JsonNode pthNode = firstFile.path("pth");

		if (pthNode.isMissingNode() || pthNode.isNull()) {
			throw new IOException("No 'pth' field found in WorldPop file metadata");
		}

		String tiffUrl = pthNode.asText();
		logger.info("Extracted TIFF URL for {}: {}", iso3, tiffUrl);

		// 3. Download and convert TIFF to PNG
		return downloadAndConvertTiffToPng(tiffUrl);
	}
}
