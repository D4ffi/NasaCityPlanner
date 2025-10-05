package com.daffidev.backcityplanner.controllers;

import com.daffidev.backcityplanner.entities.Capa;
import com.daffidev.backcityplanner.services.CapaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/capas")
@CrossOrigin(origins = "*") // Permite requests desde el frontend
public class CapaController {

    private static final Logger logger = LoggerFactory.getLogger(CapaController.class);

    private final CapaService capaService;

    public CapaController(CapaService capaService) {
        this.capaService = capaService;
    }

    /**
     * Guarda una nueva capa
     *
     * POST /api/capas/save
     * Body: {
     *   "type": "pob",
     *   "features": "[{...}]"  // JSON stringified
     * }
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveCapa(@RequestBody Map<String, String> request) {
        try {
            String type = request.get("type");
            String features = request.get("features");

            if (type == null || features == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Faltan campos requeridos: type y features"
                ));
            }

            Capa saved = capaService.saveCapa(type, features);

            return ResponseEntity.ok(Map.of(
                    "id", saved.getId(),
                    "message", "Capa guardada exitosamente",
                    "type", saved.getType()
            ));

        } catch (IllegalArgumentException e) {
            logger.error("Error validando datos: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error guardando capa", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al guardar capa"));
        }
    }

    /**
     * Obtiene todas las capas
     *
     * GET /api/capas
     */
    @GetMapping
    public ResponseEntity<List<Capa>> getAllCapas() {
        try {
            List<Capa> capas = capaService.getAllCapas();
            return ResponseEntity.ok(capas);
        } catch (Exception e) {
            logger.error("Error obteniendo capas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene capas por tipo
     *
     * GET /api/capas/type/{type}
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Capa>> getCapasByType(@PathVariable String type) {
        try {
            List<Capa> capas = capaService.getCapasByType(type);
            return ResponseEntity.ok(capas);
        } catch (Exception e) {
            logger.error("Error obteniendo capas del tipo: {}", type, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Elimina una capa por ID
     *
     * DELETE /api/capas/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCapa(@PathVariable Long id) {
        try {
            boolean deleted = capaService.deleteCapa(id);

            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Capa eliminada exitosamente"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Capa no encontrada"));
            }

        } catch (Exception e) {
            logger.error("Error eliminando capa: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al eliminar capa"));
        }
    }
}
