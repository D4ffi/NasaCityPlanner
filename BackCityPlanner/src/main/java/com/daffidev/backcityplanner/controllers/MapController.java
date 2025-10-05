package com.daffidev.backcityplanner.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.daffidev.backcityplanner.services.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/worldpop/")
public class MapController {

	private static final Logger logger = LoggerFactory.getLogger(MapController.class);

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

	/**
	 * Downloads a TIFF file from the provided URL and converts it to PNG.
	 * Returns the PNG image directly in the response.
	 *
	 * Example: GET /api/worldpop/tiff/convert?url=https://example.com/map.tiff
	 */
	@GetMapping("/tiff/convert")
	public ResponseEntity<byte[]> convertTiffFromUrl(@RequestParam String url) {
		try {
			logger.info("Received request to convert TIFF from URL: {}", url);
			byte[] pngData = mapService.downloadAndConvertTiffToPng(url);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_PNG);
			headers.setContentLength(pngData.length);
			headers.set("Content-Disposition", "inline; filename=\"converted.png\"");

			return new ResponseEntity<>(pngData, headers, HttpStatus.OK);
		} catch (IOException e) {
			logger.error("Failed to convert TIFF from URL: {}", url, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Accepts a TIFF file upload and converts it to PNG.
	 * Returns the PNG image directly in the response.
	 *
	 * Example: POST /api/worldpop/tiff/upload
	 * Content-Type: multipart/form-data
	 * Body: file=@map.tiff
	 */
	@PostMapping("/tiff/upload")
	public ResponseEntity<byte[]> convertTiffFromUpload(@RequestParam("file") MultipartFile file) {
		try {
			if (file.isEmpty()) {
				logger.warn("Received empty file upload");
				return ResponseEntity.badRequest().build();
			}

			logger.info("Received TIFF file upload: {} ({} bytes)", file.getOriginalFilename(), file.getSize());
			byte[] tiffData = file.getBytes();
			byte[] pngData = mapService.convertTiffToPng(tiffData);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_PNG);
			headers.setContentLength(pngData.length);
			String filename = file.getOriginalFilename() != null
					? file.getOriginalFilename().replace(".tiff", ".png").replace(".tif", ".png")
					: "converted.png";
			headers.set("Content-Disposition", "inline; filename=\"" + filename + "\"");

			return new ResponseEntity<>(pngData, headers, HttpStatus.OK);
		} catch (IOException e) {
			logger.error("Failed to convert uploaded TIFF file", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
