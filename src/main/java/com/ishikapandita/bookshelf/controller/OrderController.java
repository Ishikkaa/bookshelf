package com.ishikapandita.bookshelf.controller;

import com.ishikapandita.bookshelf.dtos.OrderDto;
import com.ishikapandita.bookshelf.model.Order;
import com.ishikapandita.bookshelf.request.PaymentConfirmRequest;
import com.ishikapandita.bookshelf.request.PaymentRequest;
import com.ishikapandita.bookshelf.response.ApiResponse;
import com.ishikapandita.bookshelf.service.order.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class OrderController {
    private final IOrderService orderService;

    @PostMapping("/user/{userId}/place-order")
    public ResponseEntity<ApiResponse> placeOrder(@PathVariable Long userId){
        Order order = orderService.placeOrder(userId);
        OrderDto orderDto =  orderService.convertToDto(order);
        return ResponseEntity.ok(new ApiResponse("Order placed successfully!", orderDto));
    }

    @GetMapping("/user/{userId}/order")
    private ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId){
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(new ApiResponse("Success!", orders));
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
            @RequestBody PaymentRequest request) {

        String clientSecret = orderService.createPaymentIntent(request);
        return ResponseEntity.ok(
                Map.of("clientSecret", clientSecret)
        );
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<ApiResponse> confirmPayment(
            @RequestBody PaymentConfirmRequest request) {

        orderService.confirmPayment(request.getClientSecret());
        return ResponseEntity.ok(
                new ApiResponse("Payment confirmed", 1)
        );
    }
}
