package com.uninav.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "address")
public class Address {

    @Id
    private String id;
    private String street;
    private String ApartmentNumber;
    private String city;
    private String state;
    private String zip;
    private String country;
    private String phone;
}
