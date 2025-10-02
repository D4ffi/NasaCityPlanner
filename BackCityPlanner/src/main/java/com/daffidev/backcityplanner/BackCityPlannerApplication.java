package com.daffidev.backcityplanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackCityPlannerApplication {

    public static final Logger WAKOLOGGER = LoggerFactory.getLogger(BackCityPlannerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BackCityPlannerApplication.class, args);

    }

}
