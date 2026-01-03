package com.ishikapandita.bookshelf.repository;

import com.ishikapandita.bookshelf.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUserId(Long userId);
}
