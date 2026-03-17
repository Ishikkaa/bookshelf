package com.ishikapandita.bookshelf.security.config;

import com.ishikapandita.bookshelf.dtos.BookDto;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        RedisSerializer<String> keySerializer = new StringRedisSerializer();

        Jackson2JsonRedisSerializer<BookDto> bookSerializer =
                new Jackson2JsonRedisSerializer<>(BookDto.class);

        Jackson2JsonRedisSerializer<List> listSerializer =
                new Jackson2JsonRedisSerializer<>(List.class);

        RedisCacheConfiguration bookCacheConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair.fromSerializer(keySerializer))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair.fromSerializer(bookSerializer));

        RedisCacheConfiguration bookListCacheConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair.fromSerializer(keySerializer))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair.fromSerializer(listSerializer));

        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("bookCache", bookCacheConfig);
        cacheConfigs.put("bookListCache", bookListCacheConfig);

        return RedisCacheManager.builder(connectionFactory)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }
}