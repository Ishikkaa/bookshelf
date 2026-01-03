package com.ishikapandita.bookshelf.service.cart;

import com.ishikapandita.bookshelf.model.CartItem;

public interface ICartItemService {
    void addItemToCart(Long cartId, Long bookId, int quantity);
    void removeItemFromCart(Long cartId, Long bookId);
    void updateItemQuantity(Long cartId, Long bookId, int quantity);
    CartItem getCartItem(Long cartId, Long bookId);
}
