package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateOptionRequest;
import com.scholaros.homework.dto.OptionResponse;
import com.scholaros.homework.dto.UpdateOptionRequest;

import java.util.List;
import java.util.UUID;

public interface QuestionOptionService {

    OptionResponse addOptionToQuestion(UUID questionId, CreateOptionRequest request);

    OptionResponse updateOption(UUID optionId, UpdateOptionRequest request);

    void deleteOption(UUID optionId);

    List<OptionResponse> getOptionsByQuestion(UUID questionId);
}
