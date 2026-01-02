package com.ishikapandita.bookshelf.dtos;

import lombok.Data;

@Data
public class AddressDto {
    private Long id;
    private String country;
    private Long postalCode;
    private String state;
    private String city;
    private String addressLine;
    private String addressType;
}
