package com.ishikapandita.bookshelf.service.book;

import com.ishikapandita.bookshelf.dtos.BookDto;
import com.ishikapandita.bookshelf.model.Book;
import com.ishikapandita.bookshelf.request.AddBookRequest;
import com.ishikapandita.bookshelf.request.UpdateBookRequest;

import java.util.List;

public interface IBookService {
    Book addBook(AddBookRequest request);
    Book UpdateBook(UpdateBookRequest request, Long BookId);
    Book getBookById(Long BookId);
    void deleteBookById(Long BookId);

    List<Book> getAllBooks();
    List<Book> getBooksByGenreAndAuthor(String genre, String author);
    List<Book> getBooksByGenre(String genre);
    List<Book> getBooksByAuthorAndTitle(String author, String title);
    List<Book> getBooksByAuthor(String author);
    List<Book> getBooksByTitle(String title);

//    List<Book> getDistinctBooksByTitle();

    List<BookDto> getConvertedBooks(List<Book> books);
    BookDto convertToDto(Book book);
}
