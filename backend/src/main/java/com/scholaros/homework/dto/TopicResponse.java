package com.scholaros.homework.dto;

import com.scholaros.homework.entity.DifficultyLevel;
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
public class TopicResponse {

    private UUID id;
    private UUID chapterId;
    private Integer chapterNumber;
    private String chapterTitle;
    private String topicName;
    private String learningObjectives;
    private String keywords;
    private Integer estimatedTeachingMinutes;
    private DifficultyLevel difficultyLevel;
    private Integer displayOrder;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
