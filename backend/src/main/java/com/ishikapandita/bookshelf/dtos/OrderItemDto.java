package com.ishikapandita.bookshelf.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private Long bookId;
    private String title;
    private String author;
    private int quantity;
    private BigDecimal price;
}
