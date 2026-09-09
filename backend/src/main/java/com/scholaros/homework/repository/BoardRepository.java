package com.scholaros.homework.repository;

import com.scholaros.homework.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID> {

    Optional<Board> findByIdAndActiveTrue(UUID id);

    Optional<Board> findByBoardCode(String boardCode);

    boolean existsByBoardCode(String boardCode);

    boolean existsByBoardCodeAndIdNot(String boardCode, UUID id);

    Page<Board> findByActiveTrue(Pageable pageable);

    Page<Board> findByBoardNameContainingIgnoreCaseOrBoardCodeContainingIgnoreCaseAndActiveTrue(
            String nameQuery, String codeQuery, Pageable pageable
    );
}
