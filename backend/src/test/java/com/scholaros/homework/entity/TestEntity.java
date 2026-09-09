package com.scholaros.homework.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "test_infrastructure_entity")
public class TestEntity extends BaseEntity {

    private String name;
}
