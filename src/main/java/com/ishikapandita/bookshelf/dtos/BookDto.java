package com.ishikapandita.bookshelf.dtos;

import com.ishikapandita.bookshelf.model.Genre;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookDto {
    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private String isbn;
    private String description;
    private int inventory;
    private Genre genre;
    private List<ImageDto> images;
}
