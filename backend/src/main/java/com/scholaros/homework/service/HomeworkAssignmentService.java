package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateHomeworkRequest;
import com.scholaros.homework.entity.HomeworkStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface HomeworkAssignmentService {

    HomeworkAssignmentResponse createHomework(CreateHomeworkRequest request);

    HomeworkAssignmentResponse getHomeworkById(UUID id);

    PageResponse<HomeworkAssignmentResponse> getHomeworkByStudent(UUID studentId, Pageable pageable);

    PageResponse<HomeworkAssignmentResponse> getHomeworkByTeacher(UUID teacherId, Pageable pageable);

    PageResponse<HomeworkAssignmentResponse> searchHomework(
            UUID studentId,
            UUID teacherId,
            UUID lessonSessionId,
            HomeworkStatus status,
            LocalDateTime dueDate,
            Pageable pageable
    );

    HomeworkAssignmentResponse updateHomework(UUID id, UpdateHomeworkRequest request);

    HomeworkAssignmentResponse publishHomework(UUID id);

    void deleteHomework(UUID id);
}
