package com.ishikapandita.bookshelf.service.embedding;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

@Service
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EmbeddingService(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    public String generateEmbedding(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Embedding text cannot be empty");
        }
        try {
            float[] vector = embeddingModel.embed(text.trim().toLowerCase());
            return objectMapper.writeValueAsString(vector);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate embedding", e);
        }
    }

}



