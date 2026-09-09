package com.scholaros.homework.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "scholaros.ai.gemini")
public class AiProperties {

    private String apiKey = "";
    private String model = "gemini-1.5-flash";
    private String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models";
}
