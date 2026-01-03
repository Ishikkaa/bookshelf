package com.ishikapandita.bookshelf.request;

import lombok.Data;

@Data
public class PaymentConfirmRequest {
    private String clientSecret;
}

