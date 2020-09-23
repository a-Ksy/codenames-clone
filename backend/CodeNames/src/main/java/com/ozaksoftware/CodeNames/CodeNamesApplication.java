package com.ozaksoftware.CodeNames;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class } )
@RestController
public class CodeNamesApplication {
	public static void main(String[] args) {
		SpringApplication.run(CodeNamesApplication.class, args);
	}
}
