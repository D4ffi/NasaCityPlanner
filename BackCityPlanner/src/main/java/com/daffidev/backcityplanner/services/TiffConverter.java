package com.daffidev.backcityplanner.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

/**
 * Utility class to convert TIFF images to PNG format using TwelveMonkeys ImageIO.
 */
@Component
public class TiffConverter {

	private static final Logger logger = LoggerFactory.getLogger(TiffConverter.class);

	/**
	 * Converts a TIFF image from byte array to PNG format.
	 *
	 * @param tiffData byte array containing TIFF image data
	 * @return byte array containing PNG image data
	 * @throws IOException if conversion fails
	 */
	public byte[] convertTiffToPng(byte[] tiffData) throws IOException {
		if (tiffData == null || tiffData.length == 0) {
			throw new IllegalArgumentException("TIFF data cannot be null or empty");
		}

		try (ByteArrayInputStream inputStream = new ByteArrayInputStream(tiffData)) {
			return convertTiffToPng(inputStream);
		}
	}

	/**
	 * Converts a TIFF image file to PNG format.
	 *
	 * @param tiffFile File object pointing to TIFF image
	 * @return byte array containing PNG image data
	 * @throws IOException if file reading or conversion fails
	 */
	public byte[] convertTiffToPng(File tiffFile) throws IOException {
		if (tiffFile == null || !tiffFile.exists()) {
			throw new IllegalArgumentException("TIFF file must exist");
		}

		logger.info("Converting TIFF file to PNG: {}", tiffFile.getName());
		try (FileInputStream inputStream = new FileInputStream(tiffFile)) {
			return convertTiffToPng(inputStream);
		}
	}

	/**
	 * Converts a TIFF image from InputStream to PNG format.
	 *
	 * @param tiffStream InputStream containing TIFF image data
	 * @return byte array containing PNG image data
	 * @throws IOException if stream reading or conversion fails
	 */
	public byte[] convertTiffToPng(InputStream tiffStream) throws IOException {
		if (tiffStream == null) {
			throw new IllegalArgumentException("TIFF stream cannot be null");
		}

		// Read TIFF image using TwelveMonkeys ImageIO plugin
		BufferedImage image = ImageIO.read(tiffStream);

		if (image == null) {
			throw new IOException("Failed to read TIFF image. The file may be corrupted or not a valid TIFF.");
		}

		// Convert to PNG and write to byte array
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
			boolean success = ImageIO.write(image, "png", outputStream);

			if (!success) {
				throw new IOException("Failed to write PNG image");
			}

			byte[] pngData = outputStream.toByteArray();
			logger.info("Successfully converted TIFF to PNG. Output size: {} bytes", pngData.length);
			return pngData;
		}
	}

	/**
	 * Saves TIFF data as PNG file.
	 *
	 * @param tiffData byte array containing TIFF image data
	 * @param outputFile File object where PNG will be saved
	 * @throws IOException if conversion or file writing fails
	 */
	public void saveTiffAsPng(byte[] tiffData, File outputFile) throws IOException {
		byte[] pngData = convertTiffToPng(tiffData);

		try (FileOutputStream fos = new FileOutputStream(outputFile)) {
			fos.write(pngData);
			logger.info("PNG file saved successfully: {}", outputFile.getAbsolutePath());
		}
	}
}
