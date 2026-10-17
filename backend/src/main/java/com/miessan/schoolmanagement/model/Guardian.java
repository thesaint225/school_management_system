package com.miessan.schoolmanagement.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Guardian {

    private String name;
    private String relation;
    private String phone;

    public Guardian() {
    }

    public Guardian(String name, String relation, String phone) {
        this.name = name;
        this.relation = relation;
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRelation() {
        return relation;
    }

    public void setRelation(String relation) {
        this.relation = relation;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
