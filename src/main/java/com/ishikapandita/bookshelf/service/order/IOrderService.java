package com.ishikapandita.bookshelf.service.order;

import com.ishikapandita.bookshelf.dtos.OrderDto;
import com.ishikapandita.bookshelf.model.Order;

import java.util.List;

public interface IOrderService {
    Order placeOrder(Long userId);
    List<OrderDto> getUserOrders(Long userId);
    OrderDto convertToDto(Order order);
}
