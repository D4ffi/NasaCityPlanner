package com.daffidev.backcityplanner.services;

import com.daffidev.backcityplanner.entities.Capa;
import com.daffidev.backcityplanner.repositories.CapaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CapaService {

    private static final Logger logger = LoggerFactory.getLogger(CapaService.class);

    private final CapaRepository capaRepository;
    private final ObjectMapper objectMapper;

    public CapaService(CapaRepository capaRepository) {
        this.capaRepository = capaRepository;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Guarda una nueva capa en la base de datos
     *
     * @param type Tipo de capa ("pob", "vivienda", etc.)
     * @param featuresJson String JSON con los features de GeoJSON
     * @return La capa guardada
     * @throws IllegalArgumentException si el JSON es inválido
     */
    public Capa saveCapa(String type, String featuresJson) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("El tipo de capa no puede estar vacío");
        }

        if (featuresJson == null || featuresJson.isBlank()) {
            throw new IllegalArgumentException("El JSON de features no puede estar vacío");
        }

        // Validar que el JSON es válido
        try {
            objectMapper.readTree(featuresJson);
        } catch (Exception e) {
            logger.error("JSON inválido: {}", featuresJson, e);
            throw new IllegalArgumentException("El JSON proporcionado no es válido", e);
        }

        Capa capa = new Capa();
        capa.setType(type);
        capa.setJson(featuresJson);

        Capa saved = capaRepository.save(capa);
        logger.info("Capa guardada exitosamente: id={}, type={}", saved.getId(), saved.getType());
        return saved;
    }

    /**
     * Obtiene todas las capas
     *
     * @return Lista de todas las capas
     */
    public List<Capa> getAllCapas() {
        return capaRepository.findAll();
    }

    /**
     * Obtiene capas por tipo
     *
     * @param type Tipo de capa
     * @return Lista de capas del tipo especificado
     */
    public List<Capa> getCapasByType(String type) {
        return capaRepository.findByType(type);
    }

    /**
     * Obtiene una capa por ID
     *
     * @param id ID de la capa
     * @return Optional con la capa si existe
     */
    public Optional<Capa> getCapaById(Long id) {
        return capaRepository.findById(id);
    }

    /**
     * Elimina una capa por ID
     *
     * @param id ID de la capa a eliminar
     * @return true si se eliminó, false si no existía
     */
    public boolean deleteCapa(Long id) {
        if (capaRepository.existsById(id)) {
            capaRepository.deleteById(id);
            logger.info("Capa eliminada: id={}", id);
            return true;
        }
        logger.warn("Intento de eliminar capa inexistente: id={}", id);
        return false;
    }
}
