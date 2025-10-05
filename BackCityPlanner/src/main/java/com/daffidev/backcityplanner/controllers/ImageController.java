package com.daffidev.backcityplanner.controllers;

import com.daffidev.backcityplanner.services.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Controller for serving population map images.
 * Provides simplified endpoints that handle the complete workflow:
 * fetching data, downloading TIFF, and converting to PNG.
 */
@RestController
@RequestMapping("/api/images")
public class ImageController {

	private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

	private final MapService mapService;

	public ImageController(MapService mapService) {
		this.mapService = mapService;
	}

	/**
	 * Retrieves a population map for the specified country as a PNG image.
	 * This endpoint handles the complete workflow internally:
	 * 1. Fetches WorldPop metadata for the country
	 * 2. Extracts TIFF file URL
	 * 3. Downloads and converts TIFF to PNG
	 *
	 * Example: GET /api/images/map?iso3=MEX
	 *
	 * @param iso3 ISO3 country code (default: "MEX")
	 * @return PNG image as byte array with appropriate headers
	 */
	@GetMapping("/map")
	public ResponseEntity<byte[]> getPopulationMap(@RequestParam(name = "iso3", defaultValue = "MEX") String iso3) {
		try {
			logger.info("Request received for population map: iso3={}", iso3);

			// Get PNG image data
			byte[] pngData = mapService.getPopulationMapAsPng(iso3);

			// Set response headers
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_PNG);
			headers.setContentLength(pngData.length);
			headers.set("Content-Disposition", String.format("inline; filename=\"%s_population_map.png\"", iso3.toLowerCase()));

			logger.info("Successfully generated PNG map for {}: {} bytes", iso3, pngData.length);
			return new ResponseEntity<>(pngData, headers, HttpStatus.OK);

		} catch (IOException e) {
			logger.error("Failed to generate population map for iso3={}", iso3, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
