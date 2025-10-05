package com.daffidev.backcityplanner.repositories;

import com.daffidev.backcityplanner.entities.Capa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapaRepository extends JpaRepository<Capa, Long> {

    /**
     * Encuentra todas las capas de un tipo específico
     * @param type Tipo de capa (ej: "pob", "vivienda", "transport")
     * @return Lista de capas del tipo especificado
     */
    List<Capa> findByType(String type);
}
