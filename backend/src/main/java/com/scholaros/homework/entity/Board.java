package com.scholaros.homework.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "boards")
public class Board extends BaseEntity {

    @Column(name = "board_name", nullable = false, length = 100)
    private String boardName;

    @Column(name = "board_code", nullable = false, unique = true, length = 20)
    private String boardCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
