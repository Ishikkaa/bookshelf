package com.ishikapandita.bookshelf.service.cart;

import com.ishikapandita.bookshelf.model.Cart;
import com.ishikapandita.bookshelf.model.User;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long cartId);
    Cart getCartByUserId(Long userId);
    void clearCart(Long cartId);
    Cart initializeNewCartForUser(User user);
    BigDecimal getTotalPrice(Long cartId);
}
