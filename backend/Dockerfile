# Stage 1: Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy gradle wrapper files and build configuration
COPY gradlew gradlew.bat ./
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Make gradlew executable
RUN chmod +x ./gradlew

# Download dependencies (cached layer)
RUN ./gradlew dependencies --no-daemon || true

# Copy source code
COPY src src

# Build application bootJar without running tests (tests run in CI/CD pipeline)
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Create a non-root system user and group for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy compiled bootJar from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Set file ownership to spring user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose server port
EXPOSE 8080

# Environment variable defaults
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=prod

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/actuator/health/liveness || exit 1

# Launch Spring Boot microservice
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
