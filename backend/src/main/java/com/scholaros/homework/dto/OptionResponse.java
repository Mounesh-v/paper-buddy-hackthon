package com.scholaros.homework.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionResponse {

    private UUID id;
    private UUID questionId;
    private String optionText;
    private Boolean correct;
    private Integer displayOrder;
}
