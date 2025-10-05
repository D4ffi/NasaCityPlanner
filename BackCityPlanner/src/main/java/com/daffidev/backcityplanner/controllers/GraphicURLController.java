package com.daffidev.backcityplanner.controllers;

import com.daffidev.backcityplanner.services.GraficoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for serving graphic URLs from database.
 * Provides endpoints to retrieve URLs of population graphics filtered by year.
 */
@RestController
@RequestMapping("/api/graphics")
public class GraphicURLController {

	private static final Logger logger = LoggerFactory.getLogger(GraphicURLController.class);

	private final GraficoService graficoService;

	public GraphicURLController(GraficoService graficoService) {
		this.graficoService = graficoService;
	}

	/**
	 * Retrieves all graphic URLs for the specified year.
	 * This endpoint fetches URLs from the 'grafico' table in Supabase
	 * where the year column matches the provided parameter.
	 *
	 * Example: GET /api/graphics/urls?year=2020
	 *
	 * @param year Year to filter graphics (required)
	 * @return List of graphic URLs matching the year, or 204 No Content if none found
	 */
	@GetMapping("/urls")
	public ResponseEntity<List<String>> getGraphicUrlsByYear(@RequestParam(name = "year") Integer year) {
		logger.info("Request received for graphic URLs: year={}", year);

		List<String> urls = graficoService.getGraphicUrlsByYear(year);

		if (urls.isEmpty()) {
			logger.warn("No graphic URLs found for year={}", year);
			return ResponseEntity.noContent().build();
		}

		logger.info("Successfully retrieved {} graphic URLs for year {}", urls.size(), year);
		return ResponseEntity.ok(urls);
	}
}
