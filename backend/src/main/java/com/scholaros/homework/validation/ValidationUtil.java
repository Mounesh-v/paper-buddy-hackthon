package com.scholaros.homework.validation;

import com.scholaros.homework.exception.ValidationException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ValidationUtil {

    private static final Validator VALIDATOR;

    static {
        try (final ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            VALIDATOR = factory.getValidator();
        }
    }

    public static <T> void validate(final T object, final Class<?>... groups) {
        if (object == null) {
            throw new ValidationException("Object to validate cannot be null");
        }
        final Set<ConstraintViolation<T>> violations = VALIDATOR.validate(object, groups);
        if (!violations.isEmpty()) {
            final Map<String, String> errors = new HashMap<>();
            for (final ConstraintViolation<T> violation : violations) {
                errors.put(violation.getPropertyPath().toString(), violation.getMessage());
            }
            throw new ValidationException("Validation failed for object of type " + object.getClass().getSimpleName(), errors);
        }
    }
}
