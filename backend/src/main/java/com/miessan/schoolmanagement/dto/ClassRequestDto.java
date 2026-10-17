package com.miessan.schoolmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class ClassRequestDto {

    @NotBlank(message = "Please enter a valid class title (e.g. Form 1, Form 2, Grade 10)")
    private String name;

    private String description;

    private Boolean active;

    public ClassRequestDto() {
    }

    public ClassRequestDto(String name, String description, Boolean active) {
        this.name = name;
        this.description = description;
        this.active = active != null ? active : true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
