package com.daffidev.backcityplanner.controllers;

import com.daffidev.backcityplanner.dto.PopulationImageDto;
import com.daffidev.backcityplanner.entities.Grafico;
import com.daffidev.backcityplanner.services.GraficoService;
import com.daffidev.backcityplanner.services.MapService;
import com.daffidev.backcityplanner.services.WorldPopClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Testing controller for quick endpoint validation.
 * Mapped to root path for easy testing.
 */
@RestController
@RequestMapping("/")
public class TestingController {

	private static final Logger logger = LoggerFactory.getLogger(TestingController.class);

	private final MapService mapService;
	private final WorldPopClient worldPopClient;
	private final GraficoService graficoService;

	public TestingController(MapService mapService, WorldPopClient worldPopClient, GraficoService graficoService) {
		this.mapService = mapService;
		this.worldPopClient = worldPopClient;
		this.graficoService = graficoService;
	}

	/**
	 * Test endpoint to retrieve population DTOs.
	 *
	 * Example: GET http://localhost:8080/popDtos
	 * Example: GET http://localhost:8080/popDtos?iso3=MEX
	 *
	 * @param iso3 ISO3 country code (default: "MEX")
	 * @return List of PopulationImageDto with year and image URL
	 */
//	@GetMapping("/popDtos")
//	public ResponseEntity<List<PopulationImageDto>> getPopulationDtos(@RequestParam(name = "iso3", defaultValue = "MEX") String iso3) {
//		logger.info("Testing endpoint called for iso3={}", iso3);
//
//		List<PopulationImageDto> dtos = mapService.getPopulationImages(iso3);
//
//		if (dtos.isEmpty()) {
//			logger.warn("No DTOs found for iso3={}", iso3);
//			return ResponseEntity.noContent().build();
//		}
//
//		logger.info("Returning {} DTOs for iso3={}", dtos.size(), iso3);
//		return ResponseEntity.ok(dtos);
//	}

	/**
	 * Debug endpoint to see raw JSON structure from WorldPop API.
	 *
	 * Example: GET http://localhost:8080/debugJson
	 * Example: GET http://localhost:8080/debugJson?iso3=MEX
	 *
	 * @param iso3 ISO3 country code (default: "MEX")
	 * @return Raw JSON response from WorldPop API
	 */
//	@GetMapping("/debugJson")
//	public ResponseEntity<JsonNode> debugJson(@RequestParam(name = "iso3", defaultValue = "MEX") String iso3) {
//		logger.info("Debug endpoint called for iso3={}", iso3);
//
//		JsonNode response = worldPopClient.fetchPopulationDensityByIso3(iso3);
//
//		if (response == null) {
//			logger.warn("No response from WorldPop API for iso3={}", iso3);
//			return ResponseEntity.noContent().build();
//		}
//
//		logger.info("Raw JSON response: {}", response.toPrettyString());
//		return ResponseEntity.ok(response);
//	}

	/**
	 * Endpoint to save population graphics to database.
	 * Fetches DTOs from WorldPop API and saves them to Supabase.
	 *
	 * Example: POST http://localhost:8080/saveGraphics?iso3=MEX&name=Mexico
	 * Example: POST http://localhost:8080/saveGraphics?iso3=MEX&name=Population%20Density%20Mexico
	 *
	 * @param iso3 ISO3 country code (default: "MEX") - used to fetch data from API
	 * @param name Custom name for entries in database (default: same as iso3)
	 * @return List of saved Grafico entities
	 */
//	@PostMapping("/saveGraphics")
//	public ResponseEntity<List<Grafico>> saveGraphics(
//			@RequestParam(name = "iso3", defaultValue = "MEX") String iso3,
//			@RequestParam(name = "name", required = false) String name) {
//
//		// Use iso3 as name if name parameter is not provided
//		String graphicName = (name != null && !name.isBlank()) ? name : iso3;
//
//		logger.info("Save graphics endpoint called for iso3={}, name={}", iso3, graphicName);
//
//		// 1. Get DTOs from WorldPop API
//		List<PopulationImageDto> dtos = mapService.getPopulationImages(iso3);
//
//		if (dtos.isEmpty()) {
//			logger.warn("No DTOs found to save for iso3={}", iso3);
//			return ResponseEntity.noContent().build();
//		}
//
//		// 2. Save to database with custom name
//		List<Grafico> savedGraphics = graficoService.savePopulationGraphics(graphicName, dtos);
//
//		logger.info("Successfully saved {} graphics with name={}", savedGraphics.size(), graphicName);
//		return ResponseEntity.ok(savedGraphics);
//	}
}
