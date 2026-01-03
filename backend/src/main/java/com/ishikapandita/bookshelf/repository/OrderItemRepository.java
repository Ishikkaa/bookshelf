package com.ishikapandita.bookshelf.repository;

import com.ishikapandita.bookshelf.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{

    List<OrderItem> findByBookId(Long bookId);

}
