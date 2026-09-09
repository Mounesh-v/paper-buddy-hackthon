package com.scholaros.homework.repository;

import com.scholaros.homework.entity.HomeworkQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HomeworkQuestionRepository extends JpaRepository<HomeworkQuestion, UUID> {

    List<HomeworkQuestion> findByHomeworkAssignmentIdOrderByDisplayOrderAsc(UUID homeworkAssignmentId);

    void deleteByHomeworkAssignmentId(UUID homeworkAssignmentId);
}
