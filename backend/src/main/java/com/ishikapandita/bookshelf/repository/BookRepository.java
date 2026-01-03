package com.ishikapandita.bookshelf.repository;

import com.ishikapandita.bookshelf.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByGenreNameAndAuthor(String genre, String author);

    List<Book> findByGenreName(String genre);

    List<Book> findByAuthorAndTitle(String author, String title);

    List<Book> findByAuthor(String author);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> findByTitle(String title);

    boolean existsByTitleAndAuthor(String title, String author);

}

