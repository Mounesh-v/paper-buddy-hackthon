package com.scholaros.homework.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBoardRequest {

    @Size(max = 100, message = "Board name cannot exceed 100 characters")
    private String boardName;

    @Size(max = 20, message = "Board code cannot exceed 20 characters")
    private String boardCode;

    private String description;

    private Boolean active;
}
