package com.scholaros.homework.controller;

import com.scholaros.homework.dto.HealthStatusResponse;
import com.scholaros.homework.util.ApiConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX + "/health")
@Tag(name = "Health Check", description = "Endpoints for monitoring service health and availability")
public class HealthController {

    private static final String SERVICE_NAME = "ScholarOS Homework Intelligence Service";
    private static final String STATUS_UP = "UP";

    @GetMapping
    @Operation(summary = "Check service health", description = "Public health check endpoint returning service status")
    public ResponseEntity<HealthStatusResponse> getHealthStatus() {
        log.info("Health check endpoint invoked");
        final HealthStatusResponse healthResponse = HealthStatusResponse.builder()
                .status(STATUS_UP)
                .service(SERVICE_NAME)
                .build();
        return ResponseEntity.ok(healthResponse);
    }
}
