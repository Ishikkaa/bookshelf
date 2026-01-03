package com.ishikapandita.bookshelf.repository;

import com.ishikapandita.bookshelf.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface CartItemRepository extends JpaRepository<CartItem, Long>{

    List<CartItem> findByBookId(Long bookId);

    void deleteAllByCartId(Long cartId);

}
