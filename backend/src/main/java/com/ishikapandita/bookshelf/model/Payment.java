package com.ishikapandita.bookshelf.model;

import com.ishikapandita.bookshelf.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private BigDecimal amount;
    private String currency;

    @Column(unique = true, nullable = false)
    private String clientSecret;

    private PaymentStatus status;
    // CREATED, SUCCESS, FAILED

    @CreationTimestamp
    private LocalDateTime createdAt;
}

