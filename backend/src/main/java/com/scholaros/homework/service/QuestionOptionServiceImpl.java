package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateOptionRequest;
import com.scholaros.homework.dto.OptionResponse;
import com.scholaros.homework.dto.UpdateOptionRequest;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.QuestionOption;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.QuestionOptionMapper;
import com.scholaros.homework.repository.QuestionOptionRepository;
import com.scholaros.homework.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionOptionServiceImpl implements QuestionOptionService {

    private final QuestionOptionRepository optionRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionMapper optionMapper;

    @Override
    @Transactional
    public OptionResponse addOptionToQuestion(final UUID questionId, final CreateOptionRequest request) {
        log.info("Adding option to question ID: {}", questionId);
        final Question question = questionRepository.findByIdAndActiveTrue(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        if (question.getAssessment().getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Cannot modify options for a published assessment");
        }

        final QuestionOption option = optionMapper.toEntity(request);
        option.setQuestion(question);
        if (option.getCorrect() == null) {
            option.setCorrect(false);
        }

        final QuestionOption saved = optionRepository.save(option);
        log.info("Option added successfully with ID: {}", saved.getId());
        return optionMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public OptionResponse updateOption(final UUID optionId, final UpdateOptionRequest request) {
        log.info("Updating option ID: {}", optionId);
        final QuestionOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("QuestionOption", "id", optionId));

        if (option.getQuestion().getAssessment().getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Cannot modify options for a published assessment");
        }

        optionMapper.updateEntityFromRequest(request, option);
        final QuestionOption saved = optionRepository.save(option);
        log.info("Option updated successfully with ID: {}", saved.getId());
        return optionMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteOption(final UUID optionId) {
        log.info("Deleting option ID: {}", optionId);
        final QuestionOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("QuestionOption", "id", optionId));

        if (option.getQuestion().getAssessment().getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Cannot modify options for a published assessment");
        }

        optionRepository.delete(option);
        log.info("Option deleted successfully with ID: {}", optionId);
    }

    @Override
    public List<OptionResponse> getOptionsByQuestion(final UUID questionId) {
        log.debug("Fetching options for question ID: {}", questionId);
        return optionRepository.findByQuestionIdOrderByDisplayOrderAsc(questionId).stream()
                .map(optionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
