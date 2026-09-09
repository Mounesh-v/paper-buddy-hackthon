package com.scholaros.homework.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterResponse {

    private UUID id;
    private UUID curriculumId;
    private String grade;
    private String subject;
    private Integer chapterNumber;
    private String title;
    private String description;
    private Integer estimatedTeachingHours;
    private Integer displayOrder;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
