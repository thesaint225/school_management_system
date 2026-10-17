package com.miessan.schoolmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please enter a valid subject title (e.g. Mathematics, English)")
    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "subject_code")
    private String code;

    private String department;

    @Column(length = 1000)
    private String description;

    @Column(name = "active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active = true;

    public Subject() {
    }

    public Subject(String name) {
        this.name = name;
        this.active = true;
    }

    public Subject(Long id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.active = true;
    }

    public Subject(Long id, String name, String code, String department, String description, Boolean active) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.department = department;
        this.description = description;
        this.active = active != null ? active : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active != null ? active : true;
    }
}
