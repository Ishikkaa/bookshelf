package com.ishikapandita.bookshelf.repository;

import com.ishikapandita.bookshelf.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByGenreNameAndAuthor(String genre, String author);

    List<Book> findByGenreName(String genre);

    List<Book> findByAuthorAndTitle(String author, String title);

    List<Book> findByAuthor(String author);

    boolean existsByTitleAndAuthor(String title, String author);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> findByTitle(String title);

    @Query("SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.genre LEFT JOIN FETCH b.images")
    List<Book> findAllWithDetails();

    @Query("""
            SELECT DISTINCT b FROM Book b
            LEFT JOIN FETCH b.genre g
            WHERE
                LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%'))
             OR LOWER(CAST(b.description AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
             OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%'))
             OR LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<Book> fallbackSearch(@Param("query") String query);
}

