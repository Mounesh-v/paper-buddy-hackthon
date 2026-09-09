package com.scholaros.homework.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuthentication";

    @Value("${swagger.server.url:https://smart-assignment-generator.onrender.com}")
    private String renderServerUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        final Server prodServer = new Server()
                .url(renderServerUrl)
                .description("Production Live Server (Render)");

        final Server localServer = new Server()
                .url("http://localhost:8080")
                .description("Local Development Server");

        return new OpenAPI()
                .servers(List.of(prodServer, localServer))
                .info(new Info()
                        .title("ScholarOS Homework Intelligence Service API")
                        .description("Production-grade microservice responsible for generating adaptive assessments, evaluating student mastery, assigning personalized AI homework, and providing class-level learning analytics.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("ScholarOS Team")
                                .email("support@scholaros.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://scholaros.com")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token issued by ScholarOS ERP")));
    }
}
