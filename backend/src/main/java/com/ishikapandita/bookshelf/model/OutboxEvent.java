package com.ishikapandita.bookshelf.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class OutboxEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventType;   // e.g. BOOK_CREATED
    private String payload;     // JSON (book info)

    private boolean processed = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
