package com.scholaros.homework.util;

import com.scholaros.homework.exception.BadRequestException;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class UuidUtil {

    public static UUID generateUuid() {
        return UUID.randomUUID();
    }

    public static UUID parseUuid(final String uuidStr) {
        if (uuidStr == null || uuidStr.isBlank()) {
            return null;
        }
        try {
            return UUID.fromString(uuidStr.trim());
        } catch (final IllegalArgumentException ex) {
            throw new BadRequestException("Invalid UUID format: " + uuidStr);
        }
    }

    public static boolean isValidUuid(final String uuidStr) {
        if (uuidStr == null || uuidStr.isBlank()) {
            return false;
        }
        try {
            UUID.fromString(uuidStr.trim());
            return true;
        } catch (final IllegalArgumentException ex) {
            return false;
        }
    }
}
