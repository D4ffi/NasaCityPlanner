package com.daffidev.backcityplanner.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.daffidev.backcityplanner.services.MapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/worldpop/")
public class MapController {

	private final MapService mapService;

	public MapController(MapService mapService) {
		this.mapService = mapService;
	}

	@GetMapping()
	public ResponseEntity<JsonNode> getWorldpop(@RequestParam(name = "iso3", defaultValue = "MEX") String iso3) {
		JsonNode node = mapService.getPopulationByIso3(iso3);
		if (node == null) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(node);
	}

	@GetMapping("/files")
	public ResponseEntity<JsonNode> getWorldpopFiles(@RequestParam(name = "iso3", defaultValue = "MEX") String iso3) {
		JsonNode node = mapService.getWorldpopFilesByIso3(iso3);
		if (node == null) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(node);
	}
}
