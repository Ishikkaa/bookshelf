package com.ishikapandita.bookshelf.request;

import com.ishikapandita.bookshelf.model.Genre;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateBookRequest {
    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private String isbn;
    private int inventory;
    private String description;
    private Genre genre;
}
