package com.daffidev.backcityplanner.controllers;

import com.daffidev.backcityplanner.dto.PopulationImageDto;
import com.daffidev.backcityplanner.services.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for serving population map image URLs.
 * Provides simplified endpoints that fetch population density data
 * with image URLs from WorldPop API.
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
	 * Retrieves population density map image URLs for the specified country.
	 * This endpoint fetches data from WorldPop population density API
	 * and returns a list of image URLs with their corresponding years.
	 *
	 * Example: GET /api/images/map?iso3=MEX
	 *
	 * @param iso3 ISO3 country code (default: "MEX")
	 * @return List of PopulationImageDto containing year and image URL
	 */
	@GetMapping("/map")
	public ResponseEntity<List<PopulationImageDto>> getPopulationMap(@RequestParam(name = "iso3", defaultValue = "MEX") String iso3) {
		logger.info("Request received for population map images: iso3={}", iso3);

		List<PopulationImageDto> images = mapService.getPopulationImages(iso3);

		if (images.isEmpty()) {
			logger.warn("No population images found for iso3={}", iso3);
			return ResponseEntity.noContent().build();
		}

		logger.info("Successfully retrieved {} population images for {}", images.size(), iso3);
		return ResponseEntity.ok(images);
	}
}
