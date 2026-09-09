package com.scholaros.homework.repository;

import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.AttemptStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class AssessmentAttemptSpecification {

    private AssessmentAttemptSpecification() {
    }

    public static Specification<AssessmentAttempt> buildSpecification(
            final UUID studentId,
            final UUID assessmentId,
            final AttemptStatus status,
            final LocalDateTime startDate,
            final LocalDateTime endDate
    ) {
        return (root, query, cb) -> {
            final List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("active"), true));

            if (studentId != null) {
                predicates.add(cb.equal(root.get("studentId"), studentId));
            }

            if (assessmentId != null) {
                predicates.add(cb.equal(root.get("assessment").get("id"), assessmentId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startedAt"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startedAt"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
