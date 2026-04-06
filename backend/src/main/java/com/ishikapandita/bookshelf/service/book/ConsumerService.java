package com.ishikapandita.bookshelf.service.book;

import com.ishikapandita.bookshelf.security.config.RabbitMQConfig;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Message;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Component
public class ConsumerService {

    @Autowired
    private MailService mailService;

    @RabbitListener(
            queues = RabbitMQConfig.BOOK_QUEUE,
            containerFactory = "rabbitListenerContainerFactory"
    )
    @RabbitListener(queues = RabbitMQConfig.BOOK_QUEUE)
    public void handleBookMessage(Message message, Channel channel) throws IOException {

        long deliveryTag = message.getMessageProperties().getDeliveryTag();

        try {
            String payload = new String(message.getBody(), StandardCharsets.UTF_8);
            mailService.sendEmail(
                    "ishikapandita8@gmail.com",
                    "New Book Added",
                    payload
            );
            channel.basicAck(deliveryTag, false);

        } catch (Exception e) {
            int retryCount = 0;
            Object xDeathHeader = message.getMessageProperties().getHeaders().get("x-death");
            if (xDeathHeader != null) {
                List<Map<String, Object>> xDeathList = (List<Map<String, Object>>) xDeathHeader;
                if (!xDeathList.isEmpty()) {
                    retryCount = ((Long) xDeathList.get(0).get("count")).intValue();
                }
            }

            try {
                if (retryCount >= 3) {
                    channel.basicPublish(
                            RabbitMQConfig.DLX,
                            RabbitMQConfig.DLQ_ROUTING_KEY,
                            null,
                            message.getBody()
                    );
                    channel.basicAck(deliveryTag, false); // remove from queue
                } else {
                    channel.basicNack(deliveryTag, false, false);
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
}