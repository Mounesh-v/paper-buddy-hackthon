# PROJECT_CONTEXT.md

# ScholarOS Homework Intelligence Service

## Overview

ScholarOS Homework Intelligence Service is an independent AI-powered microservice responsible for generating adaptive assessments, evaluating student mastery, assigning personalized homework, and providing learning analytics.

This service is **NOT** a School ERP.

It is designed to integrate with an external School ERP (ScholarOS ERP) through REST APIs.

The service follows a microservice architecture where each service owns its own data and business logic.

---

# Project Vision

Traditional schools assign identical homework to every student regardless of their understanding.

This service aims to replace one-size-fits-all homework with evidence-based personalized practice.

Core philosophy:

> Every minute a student spends outside the classroom should produce measurable learning.

---

# Scope

This service ONLY manages learning-related functionality.

## This service owns

- Curriculum
- Lessons
- Assessments
- Assessment Attempts
- AI Evaluation
- Personalized Homework
- Homework Submission
- Learning Analytics

---

## This service DOES NOT own

- Authentication
- User Management
- Teachers
- Students
- Parents
- Schools
- Attendance
- Fees
- Timetable
- Notifications

Those modules belong to the ScholarOS ERP.

---

# System Architecture

ScholarOS ERP

↓

Authentication

↓

Teacher / Student Portal

↓

REST APIs

↓

Homework Intelligence Service

↓

PostgreSQL Database

↓

REST Response

The ERP authenticates users and invokes this service using secure REST APIs.

This service should never manage ERP data.

---

# Architectural Principle

ScholarOS Homework Intelligence Service is designed as an independently deployable microservice.

It owns its own database and business logic.

It never directly accesses the ERP database.

All communication with the ERP must happen through versioned REST APIs.

The ERP is the source of truth for users, schools, teachers, students, and authentication.

The Homework Intelligence Service is the source of truth for assessments, homework, mastery, and learning analytics.

# Integration Strategy

This microservice communicates only through REST APIs.

The ERP sends authenticated requests to this service.

Example:

Teacher creates today's lesson

↓

ERP validates teacher

↓

ERP sends

teacherId

schoolId

sectionId

gradeId

subjectId

topicId

↓

Homework Service records lesson

No authentication logic should be implemented inside this service except JWT validation if required.

---

# External Reference Model

ERP entities should NEVER exist as JPA entities inside this project.

Instead, store only their identifiers.

Example:

teacherId

studentId

schoolId

sectionId

academicYearId

parentId

These IDs belong to the ERP and are treated as immutable references.

Never create repositories for ERP-owned entities.

Never expose CRUD APIs for ERP-owned entities.

---

# Responsibilities

## Curriculum

Owns

Board

↓

Grade

↓

Subject

↓

Chapter

↓

Topic

---

## Lesson Tracking

Stores

- teacherId
- schoolId
- gradeId
- sectionId
- subjectId
- topicId
- lessonDate

---

## Assessment Engine

Responsible for

- Assessment creation
- Question management
- Student attempts
- Evaluation

---

## Homework Intelligence

Responsible for

- AI-generated assessments
- Mastery analysis
- Personalized homework
- Homework submission
- Homework effectiveness

---

## Learning Analytics

Responsible for

- Student mastery
- Class mastery
- Teacher insights
- Heatmaps
- Homework effectiveness
- Learning timeline

---

# Architecture

Follow a layered architecture.

Controller

↓

Service

↓

Repository

↓

Database

Business logic belongs ONLY inside Services.

Repositories perform database operations only.

Controllers should never access repositories directly.

---

# Package Structure

Use a package-by-layer architecture.

com.scholaros.homework

config

security

common

controller

service

repository

entity

dto

mapper

exception

validation

util

Future packages may include

assessment

curriculum

homework

analytics

if they become sufficiently large.

---

# Technology Stack

Language

- Java 21

Framework

- Spring Boot 3

Build Tool

- Gradle (Groovy DSL)

Database

- PostgreSQL

ORM

- Spring Data JPA

Security

- Spring Security

Documentation

- SpringDoc OpenAPI

Database Migration

- Flyway

Validation

- Jakarta Bean Validation

Mapping

- MapStruct

Utilities

- Lombok

Logging

- SLF4J

---

# Coding Standards

Use Constructor Injection.

Never use Field Injection.

Never expose JPA entities through APIs.

Always use DTOs.

Use MapStruct for all mappings.

Use UUID as primary key for major entities.

Keep methods small.

Follow Single Responsibility Principle.

Avoid duplicate code.

Write meaningful class names.

Write meaningful variable names.

Prefer composition over inheritance.

---

# Validation

Validate all Request DTOs.

Use Jakarta Bean Validation.

Examples

@NotBlank

@NotNull

@Email

@Size

@Pattern

Never validate Entities directly.

---

# Exception Handling

Use centralized exception handling.

Never return stack traces.

Create custom exceptions where appropriate.

Examples

ResourceNotFoundException

BadRequestException

DuplicateResourceException

UnauthorizedException

ForbiddenException

---

# Database Guidelines

Normalize tables.

Avoid duplicate data.

Use UUID identifiers.

Include auditing fields where appropriate.

Examples

createdAt

updatedAt

createdBy

updatedBy

Prefer explicit relationships.

---

# REST API Guidelines

Follow REST principles.

Use

GET

POST

PUT

PATCH

DELETE

Version every endpoint.

Example

/api/v1/...

Return proper HTTP status codes.

---

# Logging

Use SLF4J.

Never use System.out.println().

Log

Important business events

Warnings

Errors

Unexpected failures

Avoid excessive logging.

---

# AI Integration Philosophy

Business logic should never call AI providers directly.

Create an abstraction layer.

Example

AIService

↓

GeminiProvider

↓

Future Providers

Changing AI providers should require minimal changes.

---

# Security Philosophy

The ERP authenticates users.

This service trusts authenticated requests from the ERP.

If JWT validation is implemented, it should only validate incoming tokens.

This service should not manage user login, registration, or passwords.

---

# Development Principles

Prioritize

- Simplicity
- Clean Architecture
- Maintainability
- Scalability
- Loose Coupling

Avoid premature optimization.

Only build functionality required for the current phase.

---

# Development Roadmap

Phase 1

Foundation & Curriculum

Phase 2

Assessment Engine

Phase 3

AI Homework Intelligence

Phase 4

Learning Analytics

Phase 5

Production Readiness & ERP Integration

Each phase should be fully completed before starting the next.

No unfinished features should carry over between phases.