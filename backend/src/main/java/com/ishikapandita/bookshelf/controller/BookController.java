package com.ishikapandita.bookshelf.controller;

import com.ishikapandita.bookshelf.dtos.BookDto;
import com.ishikapandita.bookshelf.model.Book;
import com.ishikapandita.bookshelf.request.AddBookRequest;
import com.ishikapandita.bookshelf.request.UpdateBookRequest;
import com.ishikapandita.bookshelf.response.ApiResponse;
import com.ishikapandita.bookshelf.service.book.IBookService;
import com.ishikapandita.bookshelf.service.semanticSearch.SemanticSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/books")
public class BookController {
    private final IBookService bookService;
    private final SemanticSearchService semanticSearchService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        List<BookDto> convertedBooks = bookService.getConvertedBooks(books);
        return ResponseEntity.ok(new ApiResponse("Found", convertedBooks));
    }

    @GetMapping("book/{bookId}/book")
    public ResponseEntity<ApiResponse> getBookById(@PathVariable Long bookId) {
        Book book = bookService.getBookById(bookId);
        BookDto bookDto = bookService.convertToDto(book);
        return ResponseEntity.ok(new ApiResponse("Found!", bookDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addBook(@RequestBody AddBookRequest request) {
        Book theBook = bookService.addBook(request);
        BookDto bookDto = bookService.convertToDto(theBook);
        return ResponseEntity.ok(new ApiResponse("Book added successfully!", bookDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/book/{bookId}/update")
    public ResponseEntity<ApiResponse> updateBook(@RequestBody UpdateBookRequest request, @PathVariable Long bookId) {
        Book theBook = bookService.UpdateBook(request, bookId);
        BookDto bookDto = bookService.convertToDto(theBook);
        return ResponseEntity.ok(new ApiResponse("Book updated successfully!", bookDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/book/{bookId}/delete")
    public ResponseEntity<ApiResponse> deleteBook(@PathVariable Long bookId) {
        bookService.deleteBookById(bookId);
        return ResponseEntity.ok(new ApiResponse("Book deleted successfully!", bookId));
    }

    @GetMapping("/book/by/author-and-title")
    public ResponseEntity<ApiResponse> getBooksByAuthorAndTitle(@RequestParam String author, @RequestParam String title) {
        List<Book> books = bookService.getBooksByAuthorAndTitle(author, title);
        List<BookDto> convertedBooks = bookService.getConvertedBooks(books);
        return ResponseEntity.ok(new ApiResponse("success", convertedBooks));
    }

    @GetMapping("/books/by/genre-and-author")
    public ResponseEntity<ApiResponse> getBooksByGenreAndAuthor(@RequestParam String genre, @RequestParam String author) {
        List<Book> books = bookService.getBooksByGenreAndAuthor(genre, author);
        List<BookDto> convertedBooks = bookService.getConvertedBooks(books);
        return ResponseEntity.ok(new ApiResponse("success", convertedBooks));
    }

    @GetMapping("/books/{title}/books")
    public ResponseEntity<ApiResponse> getBooksByTitle(@PathVariable String title) {
        List<Book> books = bookService.getBooksByTitle(title);
        List<BookDto> convertedBooks = bookService.getConvertedBooks(books);
        return ResponseEntity.ok(new ApiResponse("success", convertedBooks));
    }

    @GetMapping("/book/by-author")
    public ResponseEntity<ApiResponse> getBooksByAuthor(@RequestParam String author) {
        List<Book> books = bookService.getBooksByAuthor(author);
        List<BookDto> convertedBooks = bookService.getConvertedBooks(books);
        return ResponseEntity.ok(new ApiResponse("success", convertedBooks));
    }

    @GetMapping("/book/{genre}/all/books")
    public ResponseEntity<ApiResponse> getBooksByGenre(@PathVariable String genre) {
        List<Book> books = bookService.getBooksByGenre(genre);
        List<BookDto> convertedBooks = bookService.getConvertedBooks(books);
        return ResponseEntity.ok(new ApiResponse("success", convertedBooks));
    }

    @GetMapping("/distinct/authors")
    public ResponseEntity<ApiResponse> getDistinctBrands(){
        return ResponseEntity.ok(new ApiResponse("Found", bookService.getAllDistinctAuthors()));
    }

    @GetMapping("/semantic-search")
    public ResponseEntity<ApiResponse> semanticSearch(@RequestParam String query) {
        List<Book> books = semanticSearchService.semanticSearch(query);
        if (books.isEmpty()) {
            books = bookService.fallbackSearch(query);
        }
        List<BookDto> convertedBooks =  bookService.getConvertedBooks(books);
        return ResponseEntity.ok(new ApiResponse("success", convertedBooks));
    }

    @PostMapping("/refresh-embeddings")
    public ResponseEntity<ApiResponse> refreshEmbeddings() {
        try {
            bookService.refreshAllEmbeddings();
            return ResponseEntity.ok(new ApiResponse("Successfully re-indexed books!", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error during re-indexing: " + e.getMessage(), null));
        }
    }
}
