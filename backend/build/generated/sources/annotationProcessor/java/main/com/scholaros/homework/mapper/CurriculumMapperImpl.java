package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateCurriculumRequest;
import com.scholaros.homework.dto.CurriculumResponse;
import com.scholaros.homework.dto.UpdateCurriculumRequest;
import com.scholaros.homework.entity.Board;
import com.scholaros.homework.entity.Curriculum;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:58:40+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CurriculumMapperImpl implements CurriculumMapper {

    @Override
    public Curriculum toEntity(CreateCurriculumRequest request) {
        if ( request == null ) {
            return null;
        }

        Curriculum.CurriculumBuilder curriculum = Curriculum.builder();

        curriculum.grade( request.getGrade() );
        curriculum.subject( request.getSubject() );
        curriculum.description( request.getDescription() );

        return curriculum.build();
    }

    @Override
    public CurriculumResponse toResponse(Curriculum curriculum) {
        if ( curriculum == null ) {
            return null;
        }

        CurriculumResponse.CurriculumResponseBuilder curriculumResponse = CurriculumResponse.builder();

        curriculumResponse.boardId( curriculumBoardId( curriculum ) );
        curriculumResponse.boardCode( curriculumBoardBoardCode( curriculum ) );
        curriculumResponse.boardName( curriculumBoardBoardName( curriculum ) );
        curriculumResponse.id( curriculum.getId() );
        curriculumResponse.grade( curriculum.getGrade() );
        curriculumResponse.subject( curriculum.getSubject() );
        curriculumResponse.description( curriculum.getDescription() );
        curriculumResponse.active( curriculum.getActive() );
        curriculumResponse.createdAt( curriculum.getCreatedAt() );
        curriculumResponse.updatedAt( curriculum.getUpdatedAt() );

        return curriculumResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateCurriculumRequest request, Curriculum curriculum) {
        if ( request == null ) {
            return;
        }

        if ( request.getGrade() != null ) {
            curriculum.setGrade( request.getGrade() );
        }
        if ( request.getSubject() != null ) {
            curriculum.setSubject( request.getSubject() );
        }
        if ( request.getDescription() != null ) {
            curriculum.setDescription( request.getDescription() );
        }
        if ( request.getActive() != null ) {
            curriculum.setActive( request.getActive() );
        }
    }

    private UUID curriculumBoardId(Curriculum curriculum) {
        Board board = curriculum.getBoard();
        if ( board == null ) {
            return null;
        }
        return board.getId();
    }

    private String curriculumBoardBoardCode(Curriculum curriculum) {
        Board board = curriculum.getBoard();
        if ( board == null ) {
            return null;
        }
        return board.getBoardCode();
    }

    private String curriculumBoardBoardName(Curriculum curriculum) {
        Board board = curriculum.getBoard();
        if ( board == null ) {
            return null;
        }
        return board.getBoardName();
    }
}
