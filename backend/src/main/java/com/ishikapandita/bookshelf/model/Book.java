package com.ishikapandita.bookshelf.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity

public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String author;
    private BigDecimal price;
    private String isbn;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
    @Min(value = 0, message = "Inventory cannot be negative")
    private int inventory;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="genre_id")
    private Genre genre;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    public Book(String title, String author, BigDecimal price, String isbn, String description, int inventory,
                Genre genre) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.isbn = isbn;
        this.description = description;
        this.inventory = inventory;
        this.genre = genre;
    }
}
