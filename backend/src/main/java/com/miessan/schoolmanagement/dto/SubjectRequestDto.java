package com.miessan.schoolmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class SubjectRequestDto {

    @NotBlank(message = "Please enter a valid subject title (e.g. Mathematics, English)")
    private String name;

    @NotBlank(message = "Please enter a subject code (e.g. MTH-101, ENG-101)")
    private String code;

    private String department;

    private String description;

    private Boolean active = true;

    public SubjectRequestDto() {
    }

    public SubjectRequestDto(String name, String code, String department, String description, Boolean active) {
        this.name = name;
        this.code = code;
        this.department = department;
        this.description = description;
        this.active = active != null ? active : true;
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
