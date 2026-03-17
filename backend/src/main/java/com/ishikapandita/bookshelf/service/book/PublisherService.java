package com.ishikapandita.bookshelf.service.book;

import com.ishikapandita.bookshelf.security.config.RabbitMQConfig;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublisherService {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendBookNotification(String message) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOK_EXCHANGE,
                RabbitMQConfig.BOOK_ROUTING_KEY,
                message,
                m -> {
                    m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                    return m;
                }
        );
    }
}
