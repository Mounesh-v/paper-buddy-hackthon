package com.scholaros.homework.repository;

import com.scholaros.homework.dto.AssessmentSearchRequest;
import com.scholaros.homework.entity.Assessment;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class AssessmentSpecification {

    private AssessmentSpecification() {
    }

    public static Specification<Assessment> buildSpecification(final AssessmentSearchRequest filter) {
        return (root, query, cb) -> {
            final List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("active"), true));

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (filter.getLessonSessionId() != null) {
                predicates.add(cb.equal(root.get("lessonSession").get("id"), filter.getLessonSessionId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getAssessmentType() != null) {
                predicates.add(cb.equal(root.get("assessmentType"), filter.getAssessmentType()));
            }

            if (filter.getAvailableFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("availableFrom"), filter.getAvailableFrom()));
            }

            if (filter.getAvailableUntil() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("availableUntil"), filter.getAvailableUntil()));
            }

            if (filter.getQuery() != null && !filter.getQuery().isBlank()) {
                final String searchPattern = "%" + filter.getQuery().trim().toLowerCase() + "%";
                final Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                final Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
