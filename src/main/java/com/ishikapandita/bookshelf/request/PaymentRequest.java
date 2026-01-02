package com.ishikapandita.bookshelf.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequest {
    private Long userId;
    private BigDecimal amount;
    private String currency; // INR
}