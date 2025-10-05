package com.daffidev.backcityplanner.services;

import com.daffidev.backcityplanner.dto.PopulationImageDto;
import com.daffidev.backcityplanner.entities.Grafico;
import com.daffidev.backcityplanner.repositories.GraficoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Grafico entities (population graphics).
 */
@Service
public class GraficoService {

	private static final Logger logger = LoggerFactory.getLogger(GraficoService.class);

	private final GraficoRepository graficoRepository;

	public GraficoService(GraficoRepository graficoRepository) {
		this.graficoRepository = graficoRepository;
	}

	/**
	 * Saves population graphics from DTOs to the database.
	 *
	 * @param name Custom name to use for all entries
	 * @param dtos List of PopulationImageDto to save
	 * @return List of saved Grafico entities
	 */
	@Transactional
	public List<Grafico> savePopulationGraphics(String name, List<PopulationImageDto> dtos) {
		if (dtos == null || dtos.isEmpty()) {
			logger.warn("No DTOs provided to save for name: {}", name);
			return List.of();
		}

		// Convert DTOs to Grafico entities
		List<Grafico> graficos = dtos.stream()
				.map(dto -> new Grafico(name, dto.getPopYear(), dto.getUrlImage()))
				.collect(Collectors.toList());

		// Save all to database
		List<Grafico> saved = graficoRepository.saveAll(graficos);
		logger.info("Saved {} graphics with name: {}", saved.size(), name);

		return saved;
	}

	/**
	 * Retrieves all graphics by name (ISO3).
	 *
	 * @param name the name/ISO3 to search for
	 * @return list of graphics
	 */
	public List<Grafico> getGraphicsByName(String name) {
		return graficoRepository.findByName(name);
	}

	/**
	 * Deletes all graphics by name (ISO3).
	 *
	 * @param name the name/ISO3 to delete
	 */
	@Transactional
	public void deleteGraphicsByName(String name) {
		graficoRepository.deleteByName(name);
		logger.info("Deleted all graphics for name: {}", name);
	}
}
