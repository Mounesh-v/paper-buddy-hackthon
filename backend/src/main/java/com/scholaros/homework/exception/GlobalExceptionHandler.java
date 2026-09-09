package com.scholaros.homework.exception;

import com.scholaros.homework.common.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

import org.springframework.transaction.TransactionSystemException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleResourceNotFoundException(final ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("RESOURCE_NOT_FOUND")
                .details(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage(), details));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleBadRequestException(final BadRequestException ex) {
        log.error("Bad request: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("BAD_REQUEST")
                .details(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage(), details));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleDuplicateResourceException(final DuplicateResourceException ex) {
        log.error("Duplicate resource: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("DUPLICATE_RESOURCE")
                .details(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage(), details));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleUnauthorizedException(final UnauthorizedException ex) {
        log.error("Unauthorized: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("UNAUTHORIZED")
                .details(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage(), details));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleForbiddenException(final ForbiddenException ex) {
        log.error("Forbidden: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("FORBIDDEN")
                .details(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(ex.getMessage(), details));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleAccessDeniedException(final AccessDeniedException ex) {
        log.error("Access denied: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("ACCESS_DENIED")
                .details("Access denied: You do not have sufficient permissions")
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Access denied", details));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleValidationException(final ValidationException ex) {
        log.error("Validation error: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("VALIDATION_FAILED")
                .details(ex.getMessage())
                .validationErrors(ex.getErrors())
                .build();
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ApiResponse.error(ex.getMessage(), details));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleMethodArgumentNotValidException(final MethodArgumentNotValidException ex) {
        log.error("Request validation failed: {}", ex.getMessage());
        final Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            final String fieldName = ((FieldError) error).getField();
            final String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("VALIDATION_FAILED")
                .details("Request payload validation failed")
                .validationErrors(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Validation failed", details));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleConstraintViolationException(final ConstraintViolationException ex) {
        log.error("Constraint violation: {}", ex.getMessage());
        final Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            final String path = violation.getPropertyPath().toString();
            final String message = violation.getMessage();
            errors.put(path, message);
        });

        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("CONSTRAINT_VIOLATION")
                .details("Constraint validation failed")
                .validationErrors(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Constraint violation", details));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleDataIntegrityViolationException(final DataIntegrityViolationException ex) {
        log.error("Data integrity violation: {}", ex.getMessage());
        final String rootCauseMsg = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("DATA_INTEGRITY_VIOLATION")
                .details(rootCauseMsg)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Data integrity constraint error: " + rootCauseMsg, details));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleHttpMessageNotReadableException(final HttpMessageNotReadableException ex) {
        log.error("Malformed JSON request: {}", ex.getMessage());
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("MALFORMED_JSON")
                .details("Malformed JSON request payload or invalid data format")
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Malformed request body", details));
    }

    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleTransactionSystemException(final TransactionSystemException ex) {
        log.error("Transaction system error: {}", ex.getMessage());
        final Throwable rootCause = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause() : ex.getRootCause();
        final String detailMsg = rootCause != null && rootCause.getMessage() != null ? rootCause.getMessage() : ex.getMessage();
        
        if (rootCause instanceof BadRequestException brEx) {
            return handleBadRequestException(brEx);
        }
        if (rootCause instanceof ResourceNotFoundException rnfEx) {
            return handleResourceNotFoundException(rnfEx);
        }

        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("TRANSACTION_FAILED")
                .details(detailMsg)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Transaction failed: " + detailMsg, details));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleGlobalException(final Exception ex) {

        log.error("Unhandled internal server error occurred", ex);
        final String msg = ex.getMessage() != null && !ex.getMessage().isBlank() ? ex.getMessage() : "An unexpected error occurred.";
        final ErrorDetails details = ErrorDetails.builder()
                .errorCode("INTERNAL_SERVER_ERROR")
                .details(msg)
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(msg, details));
    }
}
