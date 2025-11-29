package com.ishikapandita.bookshelf.service.book;

import com.ishikapandita.bookshelf.dtos.BookDto;
import com.ishikapandita.bookshelf.dtos.ImageDto;
import com.ishikapandita.bookshelf.model.*;
import com.ishikapandita.bookshelf.repository.*;
import com.ishikapandita.bookshelf.request.AddBookRequest;
import com.ishikapandita.bookshelf.request.UpdateBookRequest;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService implements IBookService {
    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;
    private final ImageRepository imageRepository;

    @Override
    public Book addBook(AddBookRequest request) {
        if (BookExists(request.getTitle(), request.getAuthor())) {
            throw new EntityExistsException(request.getTitle() + " already exists!");
        }
        Genre genre = Optional.ofNullable(genreRepository.findByName(request.getGenre().getName()))
                .orElseGet(() -> {
                    Genre newGenre = new Genre(request.getGenre().getName());
                    return genreRepository.save(newGenre);
                });
        request.setGenre(genre);
        return bookRepository.save(createBook(request, genre));
    }

    private boolean BookExists(String title, String author) {
        return bookRepository.existsByTitleAndAuthor(title, author);
    }

    private Book createBook(AddBookRequest request, Genre genre) {
        return new Book(
                request.getTitle(),
                request.getAuthor(),
                request.getPrice(),
                request.getIsbn(),
                request.getDescription(),
                request.getInventory(),
                genre
        );
    }

    @Override
    public Book UpdateBook(UpdateBookRequest request, Long BookId) {
        return bookRepository.findById(BookId)
                .map(existingBook -> updateExistingBook(existingBook, request))
                .map(bookRepository::save)
                .orElseThrow(() -> new EntityNotFoundException("Book not found!"));
    }

    private Book updateExistingBook(Book existingBook, UpdateBookRequest request) {
        existingBook.setTitle(request.getTitle());
        existingBook.setAuthor(request.getAuthor());
        existingBook.setPrice(request.getPrice());
        existingBook.setIsbn(request.getIsbn());
        existingBook.setInventory(request.getInventory());
        existingBook.setDescription(request.getDescription());

        //create new genre if the genre in request does not exist
        String genreName = request.getGenre().getName();
        Genre genre = genreRepository.findByName(genreName);
        if (genre == null) {
            genre = new Genre(genreName);
            genreRepository.save(genre);
        }
        existingBook.setGenre(genre);

        return existingBook;
    }

    @Override
    public void deleteBookById(Long BookId) {
        bookRepository.findById(BookId)
                .ifPresentOrElse(book -> {
                    List<CartItem> cartItems = cartItemRepository.findByBookId(BookId);
                    cartItems.forEach(cartItem -> {
                        Cart cart = cartItem.getCart();
                        cart.removeItem(cartItem);
                        cartItemRepository.delete(cartItem);
                    });

                    List<OrderItem> orderItems = orderItemRepository.findByBookId(BookId);
                    orderItems.forEach(orderItem -> {
                        orderItem.setBook(null);
                        orderItemRepository.save(orderItem);
                    });

                    Optional.ofNullable(book.getGenre())
                            .ifPresent(genre -> genre.getBooks().remove(book));
                    book.setGenre(null);

                    bookRepository.deleteById(book.getId());

                }, () -> {
                    throw new EntityNotFoundException("Book not found!");
                });
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long BookId) {
        return bookRepository.findById(BookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));
    }

    @Override
    public List<Book> getBooksByGenreAndAuthor(String genre, String author) {
        return bookRepository.findByGenreNameAndAuthor(genre, author);
    }

    @Override
    public List<Book> getBooksByGenre(String genre) {
        return bookRepository.findByGenreName(genre);
    }

    @Override
    public List<Book> getBooksByAuthorAndTitle(String author, String title) {
        return bookRepository.findByAuthorAndTitle(author, title);
    }

    @Override
    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findByAuthor(author);
    }

    @Override
    public List<Book> getBooksByTitle(String title) {
        return bookRepository.findByTitle(title);
    }

//    @Override
//    public List<Book> getDistinctBooksByTitle(){
//        List<Book> books = getAllBooks();
//        Map<String, Book> distinctBookMap = books.stream()
//                .collect(Collectors.toMap(
//                        Book :: getTitle,
//                        book -> book,
//                        (existing, replacement) -> existing));
//        return new ArrayList<>(distinctBookMap.values());
//    }

    @Override
    public List<BookDto> getConvertedBooks(List<Book> books) {
        return books.stream().map(this::convertToDto).toList();
    }

    @Override
    public BookDto convertToDto(Book book) {
        BookDto bookDto = modelMapper.map(book, BookDto.class);
        List<Image> images = imageRepository.findByBookId(book.getId());
        List<ImageDto> imageDto = images.stream()
                .map(image -> modelMapper.map(image, ImageDto.class))
                .toList();
        bookDto.setImages(imageDto);
        return bookDto;
    }
}
