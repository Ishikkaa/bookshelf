package com.ishikapandita.bookshelf.security.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String BOOK_QUEUE = "bookQueue";
    public static final String BOOK_EXCHANGE = "bookExchange";
    public static final String BOOK_ROUTING_KEY = "bookRoutingKey";

    public static final String RETRY_QUEUE = "bookRetryQueue";
    public static final String RETRY_ROUTING_KEY = "bookRetryKey";

    public static final String DLQ = "bookDLQ";
    public static final String DLQ_ROUTING_KEY = "bookDLQKey";

    public static final String DLX = "bookDLX";

    // MAIN QUEUE
    @Bean
    public Queue bookQueue() {
        return QueueBuilder.durable(BOOK_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX)
                .withArgument("x-dead-letter-routing-key", RETRY_ROUTING_KEY) // → retry queue
                .build();
    }

    @Bean
    public DirectExchange bookExchange() {
        return new DirectExchange(BOOK_EXCHANGE);
    }

    @Bean
    public Binding bookBinding() {
        return BindingBuilder.bind(bookQueue())
                .to(bookExchange())
                .with(BOOK_ROUTING_KEY);
    }

    // RETRY QUEUE (TTL → back to main queue)
    @Bean
    public Queue retryQueue() {
        return QueueBuilder.durable(RETRY_QUEUE)
                .withArgument("x-message-ttl", 10000) // 10 sec delay
                .withArgument("x-dead-letter-exchange", BOOK_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", BOOK_ROUTING_KEY) // → back to main queue
                .build();
    }

    @Bean
    public Binding retryBinding() {
        return BindingBuilder.bind(retryQueue())
                .to(deadLetterExchange())
                .with(RETRY_ROUTING_KEY);
    }

    // DLQ (FINAL FAILURE)
    @Bean
    public Queue deadLetterQueue() {
        return QueueBuilder.durable(DLQ).build();
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DLX);
    }

    @Bean
    public Binding dlqBinding() {
        return BindingBuilder.bind(deadLetterQueue())
                .to(deadLetterExchange())
                .with(DLQ_ROUTING_KEY);
    }

    // MANUAL ACK CONFIG
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory
    ) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        return factory;
    }
}