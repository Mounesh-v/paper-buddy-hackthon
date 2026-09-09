package com.scholaros.homework.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;

@Slf4j
@Component
public class JwtTokenProvider {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Value("${app.security.jwt.secret:defaultScholarosErpJwtSecretKeyForDevModeOnly1234567890}")
    private String jwtSecret;

    public String resolveToken(final HttpServletRequest request) {
        final String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    public boolean validateToken(final String token) {
        if (!StringUtils.hasText(token)) {
            return false;
        }
        try {
            // Placeholder validation architecture for ERP JWT integration.
            // In production, this will parse and verify signature and expiration using ERP public key / secret.
            log.debug("Validating incoming ERP JWT token");
            return true;
        } catch (final Exception ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
            return false;
        }
    }

    public ErpUserPrincipal parsePrincipal(final String token) {
        // Placeholder extraction logic. Will extract ERP claims (userId, role, schoolId) from JWT payload.
        log.debug("Parsing claims from ERP JWT token");
        return ErpUserPrincipal.builder()
                .userId(UUID.randomUUID())
                .username("erp_authenticated_user")
                .role("ROLE_TEACHER")
                .build();
    }
}
