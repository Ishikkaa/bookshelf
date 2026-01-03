package com.ishikapandita.bookshelf.service.cart;

import com.ishikapandita.bookshelf.model.Book;
import com.ishikapandita.bookshelf.model.Cart;
import com.ishikapandita.bookshelf.model.CartItem;
import com.ishikapandita.bookshelf.repository.CartItemRepository;
import com.ishikapandita.bookshelf.repository.CartRepository;
import com.ishikapandita.bookshelf.service.book.IBookService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartItemService implements ICartItemService{
    private final CartItemRepository cartItemRepository;
    private final ICartService cartService;
    private final IBookService bookService;
    private final CartRepository cartRepository;

    @Override
    public void addItemToCart(Long cartId, Long bookId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        Book book = bookService.getBookById(bookId);
        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item -> item.getBook().getId().equals(bookId))
                .findFirst().orElse(new CartItem());
        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setBook(book);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(book.getPrice());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }
        cartItem.setTotalPrice();
        cart.addItem(cartItem);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }

    @Override
    public void removeItemFromCart(Long cartId, Long bookId) {
        Cart cart = cartService.getCart(cartId);
        CartItem itemToRemove = getCartItem(cartId, bookId);
        cart.removeItem(itemToRemove);
        cartRepository.save(cart);
    }

    @Override
    public void updateItemQuantity(Long cartId, Long bookId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        cart.getItems().stream()
                .filter(item -> item.getBook().getId().equals(bookId))
                .findFirst().ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setUnitPrice(item.getBook().getPrice());
                    item.setTotalPrice();
                });
        BigDecimal totalAmount = cart.getItems().stream().map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(totalAmount);
        cartRepository.save(cart);
    }

    @Override
    public CartItem getCartItem(Long cartId, Long bookId) {
        Cart cart = cartService.getCart(cartId);
        return cart.getItems()
                .stream()
                .filter(item -> item.getBook().getId().equals(bookId))
                .findFirst().orElseThrow(() -> new EntityNotFoundException("Cart Item not found!"));
    }
}
