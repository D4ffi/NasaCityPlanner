package com.daffidev.backcityplanner.repositories;

import com.daffidev.backcityplanner.entities.Grafico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for accessing the 'grafico' table in Supabase.
 */
@Repository
public interface GraficoRepository extends JpaRepository<Grafico, Long> {

	/**
	 * Find all graphics by name (e.g., ISO3 country code).
	 *
	 * @param name the name/ISO3 to search for
	 * @return list of graphics matching the name
	 */
	List<Grafico> findByName(String name);

	/**
	 * Find all graphics by year.
	 *
	 * @param year the year to search for
	 * @return list of graphics matching the year
	 */
	List<Grafico> findByYear(Integer year);

	/**
	 * Delete all graphics by name.
	 *
	 * @param name the name/ISO3 to delete
	 */
	void deleteByName(String name);
}
