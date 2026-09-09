package com.scholaros.homework.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {

    private String errorCode;
    private String details;
    private Map<String, String> validationErrors;
}
