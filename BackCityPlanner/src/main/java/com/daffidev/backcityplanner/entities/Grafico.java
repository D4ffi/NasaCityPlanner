package com.daffidev.backcityplanner.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing the 'grafico' table in Supabase.
 * Stores population graphics data with year and URL.
 */
@Entity
@Table(name = "grafico")
public class Grafico {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	private LocalDateTime createdAt;

	@Column(name = "name")
	private String name;

	@Column(name = "year")
	private Integer year;

	@Column(name = "url", columnDefinition = "TEXT")
	private String url;

	public Grafico() {
		this.createdAt = LocalDateTime.now();
	}

	public Grafico(String name, Integer year, String url) {
		this.name = name;
		this.year = year;
		this.url = url;
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public String toString() {
		return "Grafico{" +
				"id=" + id +
				", createdAt=" + createdAt +
				", name='" + name + '\'' +
				", year=" + year +
				", url='" + url + '\'' +
				'}';
	}
}
