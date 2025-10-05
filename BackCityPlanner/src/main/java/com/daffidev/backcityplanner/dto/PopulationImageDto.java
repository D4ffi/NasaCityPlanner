package com.daffidev.backcityplanner.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for population density image information.
 * Contains the year and URL of the population image.
 */
public class PopulationImageDto {

	@JsonProperty("popyear")
	private Integer popYear;

	@JsonProperty("url_img")
	private String urlImage;

	public PopulationImageDto() {
	}

	public PopulationImageDto(Integer popYear, String urlImage) {
		this.popYear = popYear;
		this.urlImage = urlImage;
	}

	public Integer getPopYear() {
		return popYear;
	}

	public void setPopYear(Integer popYear) {
		this.popYear = popYear;
	}

	public String getUrlImage() {
		return urlImage;
	}

	public void setUrlImage(String urlImage) {
		this.urlImage = urlImage;
	}

	@Override
	public String toString() {
		return "PopulationImageDto{" +
				"popYear=" + popYear +
				", urlImage='" + urlImage + '\'' +
				'}';
	}
}
