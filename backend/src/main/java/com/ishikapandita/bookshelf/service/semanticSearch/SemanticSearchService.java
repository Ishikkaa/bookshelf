package com.ishikapandita.bookshelf.service.semanticSearch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ishikapandita.bookshelf.model.Book;
import com.ishikapandita.bookshelf.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SemanticSearchService {

    private final EmbeddingModel embeddingModel;
    private final BookRepository bookRepository;
    private final ObjectMapper objectMapper;
    private static final double SIMILARITY_THRESHOLD = 0.35;
    private record ScoredBook(Book book, double score) {}
    private final Map<String, float[]> queryEmbeddingCache = new ConcurrentHashMap<>();
    private final Map<Long, float[]> bookEmbeddingCache = new ConcurrentHashMap<>();

    public List<Book> semanticSearch(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        float[] queryEmbedding = getQueryEmbedding(query);

        return bookRepository.findAllWithDetails()
                .stream()
                .filter(book -> book.getEmbedding() != null)
                .map(book -> {

                    double similarity = cosineSimilarity(
                            queryEmbedding,
                            getBookEmbedding(book)
                    );

                    String q = query.toLowerCase().trim();
                    String genre = book.getGenre() != null
                            ? book.getGenre().getName().toLowerCase()
                            : "";
                    String title = book.getTitle().toLowerCase();
                    if (q.contains(genre)) {
                        similarity += 0.05;
                    }
                    Set<String> queryTokens = new HashSet<>(Arrays.asList(q.split("\\s+")));
                    Set<String> titleTokens = new HashSet<>(Arrays.asList(title.split("\\s+")));

                    queryTokens.retainAll(titleTokens);
                    if (!queryTokens.isEmpty()) {
                        similarity += 0.06;
                    }
                    if (title.contains(q) || q.contains(title)) {
                        similarity += 0.08;
                    }
                    if (!q.contains(genre) && similarity < 0.55) {
                        similarity -= 0.04;
                    }

                    System.out.printf(
                            "[SemanticScore] title=\"%-25s\" | finalScore=%.4f%n",
                            book.getTitle(),
                            similarity
                    );
                    similarity = Math.min(similarity, 0.95);
                    return new ScoredBook(book, similarity);
                })
                .filter(scored -> scored.score() >= SIMILARITY_THRESHOLD)
                .sorted(Comparator.comparingDouble(ScoredBook::score).reversed())
                .map(ScoredBook::book)
                .limit(8)
                .toList();
    }

    public void addBookToCache(Book book) {
        if (book.getEmbedding() != null) {
            bookEmbeddingCache.put(book.getId(), deserializeEmbedding(book.getEmbedding()));
        }
    }

    public void updateBookInCache(Book book) {
        if (book.getEmbedding() != null) {
            bookEmbeddingCache.put(book.getId(), deserializeEmbedding(book.getEmbedding()));
        }
    }

    public void removeBookFromCache(Long bookId) {
        bookEmbeddingCache.remove(bookId);
    }

    private float[] getBookEmbedding(Book book) {
        return bookEmbeddingCache.computeIfAbsent(
                book.getId(),
                id -> deserializeEmbedding(book.getEmbedding())
        );
    }

    private float[] getQueryEmbedding(String query) {
        String cleanQuery = query.trim().toLowerCase();
        return queryEmbeddingCache.computeIfAbsent(
                cleanQuery,
                q -> embeddingModel.embed(q) // Use raw string for best vector alignment
        );
    }

    private float[] deserializeEmbedding(String embeddingJson) {
        try {
            return objectMapper.readValue(embeddingJson, float[].class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse embedding JSON for book", e);
        }
    }

    private double cosineSimilarity(float[] vectorA, float[] vectorB) {
        if (vectorA == null || vectorB == null || vectorA.length != vectorB.length) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }

        double denominator = Math.sqrt(normA) * Math.sqrt(normB);
        if (denominator == 0) return 0.0;

        double result = dotProduct / denominator;
        return Double.isNaN(result) ? 0.0 : result;
    }

    public void clearCaches() {
        queryEmbeddingCache.clear();
        bookEmbeddingCache.clear();
    }
}