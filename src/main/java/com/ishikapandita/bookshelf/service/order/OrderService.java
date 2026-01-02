package com.ishikapandita.bookshelf.service.order;

import com.ishikapandita.bookshelf.dtos.OrderDto;
import com.ishikapandita.bookshelf.dtos.OrderItemDto;
import com.ishikapandita.bookshelf.enums.OrderStatus;
import com.ishikapandita.bookshelf.enums.PaymentStatus;
import com.ishikapandita.bookshelf.model.*;
import com.ishikapandita.bookshelf.repository.BookRepository;
import com.ishikapandita.bookshelf.repository.OrderRepository;
import com.ishikapandita.bookshelf.repository.PaymentRepository;
import com.ishikapandita.bookshelf.request.PaymentRequest;
import com.ishikapandita.bookshelf.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final PaymentRepository paymentRepository;
    private final ICartService cartService;
    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public Order placeOrder(Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        Order order = createOrder(cart);
        List<OrderItem> orderItemList = createOrderItems(order, cart);
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setTotalAmount(calculateTotalAmount(orderItemList));
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(cart.getId());
        return savedOrder;
    }

    private Order createOrder(Cart cart) {
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return order;
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream().map(cartItem -> {
            Book book = cartItem.getBook();
            book.setInventory(book.getInventory() - cartItem.getQuantity());
            bookRepository.save(book);
            return new OrderItem(
                    order,
                    book,
                    cartItem.getUnitPrice(),
                    cartItem.getQuantity());
        }).toList();
    }

    private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList) {
        return orderItemList.stream()
                .map(item -> item.getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public String createPaymentIntent(PaymentRequest request) {
        if (request.getAmount() == null ||
                request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid payment amount");
        }
        String clientSecret = "pi_mock_" + UUID.randomUUID();
        Payment payment = new Payment();
        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setStatus(PaymentStatus.CREATED);
        payment.setClientSecret(clientSecret);

        paymentRepository.save(payment);
        return clientSecret;
    }

    @Override
    public void confirmPayment(String clientSecret) {
        Payment payment = paymentRepository
                .findByClientSecret(clientSecret)
                .orElseThrow(() -> new RuntimeException("Invalid payment"));

        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);
    }


    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return  orders.stream().map(this :: convertToDto).toList();
    }

    @Override
    public OrderDto convertToDto(Order order) {
        OrderDto dto = modelMapper.map(order, OrderDto.class);

        dto.setItems(
                order.getOrderItems().stream().map(item -> {
                    OrderItemDto itemDto = new OrderItemDto();
                    itemDto.setBookId(item.getBook().getId());
                    itemDto.setTitle(item.getBook().getTitle());
                    itemDto.setAuthor(item.getBook().getAuthor());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setPrice(item.getPrice());
                    return itemDto;
                }).toList()
        );
        return dto;
    }
}
