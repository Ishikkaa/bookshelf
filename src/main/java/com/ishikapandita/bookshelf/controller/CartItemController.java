package com.ishikapandita.bookshelf.controller;

import com.ishikapandita.bookshelf.model.Cart;
import com.ishikapandita.bookshelf.model.User;
import com.ishikapandita.bookshelf.response.ApiResponse;
import com.ishikapandita.bookshelf.service.cart.ICartItemService;
import com.ishikapandita.bookshelf.service.cart.ICartService;
import com.ishikapandita.bookshelf.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/cartItems")
public class CartItemController {
    private final ICartItemService cartItemService;
    private final IUserService userService;
    private final ICartService cartService;

    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addItemToCart(
            @RequestParam Long bookId,
            @RequestParam int quantity){
        User user = userService.getAuthenticatedUser();
        Cart cart = cartService.initializeNewCartForUser(user);
        cartItemService.addItemToCart(cart.getId(), bookId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item added successfully!", null ));
    }

    @DeleteMapping("/cart/{cartId}/item/{itemId}/remove")
    public ResponseEntity<ApiResponse> removeItemFromCart(@PathVariable Long cartId,@PathVariable Long itemId){
        cartItemService.removeItemFromCart(cartId, itemId);
        return ResponseEntity.ok(new ApiResponse("Item removed successfully!", null));
    }

    @PutMapping("/cart/{cartId}/item/{itemId}/update")
    public ResponseEntity<ApiResponse> updateCartItem(
            @PathVariable Long cartId,
            @PathVariable Long itemId,
            @RequestParam int quantity){
        cartItemService.updateItemQuantity(cartId, itemId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item updated successfully!", null));
    }
}
