package com.scholaros.homework.service;

import com.scholaros.homework.dto.GenerateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;

public interface HomeworkGeneratorService {

    HomeworkAssignmentResponse generateHomeworkFromRecommendation(GenerateHomeworkRequest request);
}
