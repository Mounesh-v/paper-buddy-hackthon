package com.scholaros.homework.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@Getter
@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class ValidationException extends RuntimeException {

    private final Map<String, String> errors;

    public ValidationException(final String message) {
        super(message);
        this.errors = Map.of();
    }

    public ValidationException(final String message, final Map<String, String> errors) {
        super(message);
        this.errors = errors != null ? Map.copyOf(errors) : Map.of();
    }
}
