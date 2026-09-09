package com.scholaros.homework.repository;

import com.scholaros.homework.dto.LessonSearchRequest;
import com.scholaros.homework.entity.LessonSession;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class LessonSessionSpecification {

    private LessonSessionSpecification() {
    }

    public static Specification<LessonSession> buildSpecification(final LessonSearchRequest filter) {
        return (root, query, cb) -> {
            final List<Predicate> predicates = new ArrayList<>();

            // Always filter for active lesson sessions
            predicates.add(cb.equal(root.get("active"), true));

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (filter.getTeacherId() != null) {
                predicates.add(cb.equal(root.get("teacherId"), filter.getTeacherId()));
            }

            if (filter.getSchoolId() != null) {
                predicates.add(cb.equal(root.get("schoolId"), filter.getSchoolId()));
            }

            if (filter.getSectionId() != null) {
                predicates.add(cb.equal(root.get("sectionId"), filter.getSectionId()));
            }

            if (filter.getCurriculumId() != null) {
                predicates.add(cb.equal(root.get("curriculum").get("id"), filter.getCurriculumId()));
            }

            if (filter.getChapterId() != null) {
                predicates.add(cb.equal(root.get("chapter").get("id"), filter.getChapterId()));
            }

            if (filter.getTopicId() != null) {
                predicates.add(cb.equal(root.get("topic").get("id"), filter.getTopicId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getTeachingMode() != null) {
                predicates.add(cb.equal(root.get("teachingMode"), filter.getTeachingMode()));
            }

            if (filter.getLessonDate() != null) {
                predicates.add(cb.equal(root.get("lessonDate"), filter.getLessonDate()));
            }

            if (filter.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("lessonDate"), filter.getStartDate()));
            }

            if (filter.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("lessonDate"), filter.getEndDate()));
            }

            if (filter.getQuery() != null && !filter.getQuery().isBlank()) {
                final String searchPattern = "%" + filter.getQuery().trim().toLowerCase() + "%";
                final Predicate titleMatch = cb.like(cb.lower(root.get("lessonTitle")), searchPattern);
                final Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
