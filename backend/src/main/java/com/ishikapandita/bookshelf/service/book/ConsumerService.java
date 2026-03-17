package com.ishikapandita.bookshelf.service.book;

import com.ishikapandita.bookshelf.security.config.RabbitMQConfig;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.rabbitmq.client.Channel;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class ConsumerService {

    @Autowired
    private MailService mailService;

    @RabbitListener(
            queues = RabbitMQConfig.BOOK_QUEUE,
            ackMode = "MANUAL"
    )
    public void handleBookMessage(Message message, Channel channel) {
        try {
            String payload = new String(message.getBody(), StandardCharsets.UTF_8);

            // Send email
            mailService.sendEmail(
                    "ishikapandita8@gmail.com",
                    "New Book Added",
                    payload
            );

            // Acknowledge successful processing
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            try {
                // Reject message and send to DLQ
                channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, false);
            } catch (IOException ioException) {
                throw new RuntimeException(ioException);
            }
        }
    }
}