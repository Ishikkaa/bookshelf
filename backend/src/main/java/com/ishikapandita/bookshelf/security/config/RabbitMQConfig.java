package com.ishikapandita.bookshelf.security.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String BOOK_QUEUE = "bookQueue";
    public static final String BOOK_EXCHANGE = "bookExchange";
    public static final String BOOK_ROUTING_KEY = "bookRoutingKey";

    public static final String DLQ = "bookDLQ";
    public static final String DLX = "bookDLX";
    public static final String DLQ_ROUTING_KEY = "bookDLQKey";

    @Bean
    public Queue bookQueue() {
        return QueueBuilder.durable(BOOK_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX)
                .withArgument("x-dead-letter-routing-key", DLQ_ROUTING_KEY)
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

    // DLQ
    @Bean
    public Queue deadLetterQueue() {
        return new Queue(DLQ, true);
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
}
