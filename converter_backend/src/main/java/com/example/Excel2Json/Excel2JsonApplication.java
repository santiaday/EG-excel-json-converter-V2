package com.example.Excel2Json;

import com.example.Excel2Json.property.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Timer;
import java.util.TimerTask;


class Helper extends TimerTask {
	public void run() {
		File dir = new File("C:\\Users\\santi\\Documents\\EG_JSON-Excel-Converter\\converter_backend\\springBootUploads");
		File[] directoryListing = dir.listFiles();
		if (directoryListing != null) {
			for (File child : directoryListing) {
				long lastModified = child.lastModified();
				long epochTime = System.currentTimeMillis();
				if((epochTime - lastModified) > 600000){
					Path path = Paths.get(String.format("C:\\Users\\santi\\Documents\\EG_JSON-Excel-Converter\\converter_backend\\springBootUploads\\%s", child.getName()));
					try {
						Files.delete(path);
					} catch (IOException e) {
						throw new RuntimeException(e);
					}
				}
			}
		} else {
		System.out.println("Dir does not exist");

		}
	}
}

@SpringBootApplication
@EnableConfigurationProperties({
		FileStorageProperties.class
})

public class Excel2JsonApplication {
	public static void main(String[] args) throws Exception {


		SpringApplication.run(Excel2JsonApplication.class, args);

		Timer timer = new Timer();
		TimerTask task = new Helper();

		timer.schedule(task , 1, 600000);

	}


	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/greeting-javaconfig").allowedOrigins("http://localhost:8080");
			}
		};
	}




}