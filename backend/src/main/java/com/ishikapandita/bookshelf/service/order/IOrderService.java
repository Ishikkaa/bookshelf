package com.ishikapandita.bookshelf.service.order;

import com.ishikapandita.bookshelf.dtos.OrderDto;
import com.ishikapandita.bookshelf.model.Order;
import com.ishikapandita.bookshelf.request.PaymentRequest;

import java.util.List;

public interface IOrderService {
    Order placeOrder(Long userId);

    String createPaymentIntent(PaymentRequest request);

    void confirmPayment(String clientSecret);

    List<OrderDto> getUserOrders(Long userId);
    OrderDto convertToDto(Order order);
}
