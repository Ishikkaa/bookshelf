package com.ishikapandita.bookshelf.request;

import com.ishikapandita.bookshelf.model.Genre;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdateBookRequest {
    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private String isbn;
    private int inventory;
    private String description;
    @NotEmpty(message = "At least one trope is required")
    private List<String> tropes;

    @NotEmpty(message = "At least one theme is required")
    private List<String> themes;

    private Genre genre;
}
