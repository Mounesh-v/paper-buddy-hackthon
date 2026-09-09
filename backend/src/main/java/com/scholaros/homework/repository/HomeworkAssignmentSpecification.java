package com.scholaros.homework.repository;

import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class HomeworkAssignmentSpecification {

    private HomeworkAssignmentSpecification() {
    }

    public static Specification<HomeworkAssignment> buildSpecification(
            final UUID studentId,
            final UUID teacherId,
            final UUID lessonSessionId,
            final HomeworkStatus status,
            final LocalDateTime dueDate
    ) {
        return (root, query, cb) -> {
            final List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("active"), true));

            if (studentId != null) {
                predicates.add(cb.equal(root.get("studentId"), studentId));
            }

            if (teacherId != null) {
                predicates.add(cb.equal(root.get("teacherId"), teacherId));
            }

            if (lessonSessionId != null) {
                predicates.add(cb.equal(root.get("lessonSession").get("id"), lessonSessionId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (dueDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dueDate"), dueDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
