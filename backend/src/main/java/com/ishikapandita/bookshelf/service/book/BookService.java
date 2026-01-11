package com.ishikapandita.bookshelf.service.book;

import com.ishikapandita.bookshelf.dtos.BookDto;
import com.ishikapandita.bookshelf.dtos.ImageDto;
import com.ishikapandita.bookshelf.model.*;
import com.ishikapandita.bookshelf.repository.*;
import com.ishikapandita.bookshelf.request.AddBookRequest;
import com.ishikapandita.bookshelf.request.UpdateBookRequest;
import com.ishikapandita.bookshelf.service.embedding.EmbeddingService;
import com.ishikapandita.bookshelf.service.semanticSearch.SemanticSearchService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService implements IBookService {
    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;
    private final ImageRepository imageRepository;
    private final EmbeddingService embeddingService;
    private final SemanticSearchService semanticSearchService;

    private String buildTextForEmbedding(Book book) {
        String title = book.getTitle() != null ? book.getTitle() : "Untitled";
        String genre = book.getGenre() != null ? book.getGenre().getName() : "";
        String tropes = (book.getTropes() != null && !book.getTropes().isEmpty())
                ? String.join(", ", book.getTropes()) : "none";
        String themes = (book.getThemes() != null && !book.getThemes().isEmpty())
                ? String.join(", ", book.getThemes()) : "none";

        return String.format(
                "Book Title: %s. This is a %s novel featuring tropes like %s. It explores themes of %s. The story follows: %s",
                title,
                genre,
                tropes,
                themes,
                summarizeDescription(book.getDescription())
        ).toLowerCase();
    }
    private String summarizeDescription(String description) {
        if (description == null) return "";
        return description.length() > 400
                ? description.substring(0, 400)
                : description;
    }

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
        Book book = createBook(request, genre);
        book.setTropes(List.copyOf(request.getTropes()));
        book.setThemes(List.copyOf(request.getThemes()));
        //embedding generated ONCE
        String embeddingText = buildTextForEmbedding(book);
        String embeddingJson = embeddingService.generateEmbedding(embeddingText);
        book.setEmbedding(embeddingJson);

        Book savedBook = bookRepository.save(book);
        semanticSearchService.addBookToCache(savedBook);
        return savedBook;
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

        boolean semanticChanged =
                !existingBook.getTitle().equals(request.getTitle()) ||
                        !existingBook.getGenre().getName().equals(request.getGenre().getName()) ||
                        !existingBook.getDescription().equals(request.getDescription()) ||
                        !existingBook.getTropes().equals(request.getTropes()) ||
                        !existingBook.getThemes().equals(request.getThemes());

        existingBook.setTitle(request.getTitle());
        existingBook.setAuthor(request.getAuthor());
        existingBook.setPrice(request.getPrice());
        existingBook.setIsbn(request.getIsbn());
        existingBook.setInventory(request.getInventory());
        existingBook.setDescription(request.getDescription());
        existingBook.setTropes(request.getTropes());
        existingBook.setThemes(request.getThemes());

        Genre genre = genreRepository.findByName(request.getGenre().getName());
        existingBook.setGenre(genre);

        if (semanticChanged) {
            String embeddingText = buildTextForEmbedding(existingBook);
            existingBook.setEmbedding(embeddingService.generateEmbedding(embeddingText));
            semanticSearchService.updateBookInCache(existingBook);
        }

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

                    semanticSearchService.removeBookFromCache(book.getId());

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

    @Override
    public List<String> getAllDistinctAuthors(){
        return bookRepository.findAll()
                .stream()
                .map(Book :: getAuthor)
                .distinct()
                .toList();
    }

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

    @Override
    public List<Book> fallbackSearch(String query) {
        return bookRepository.fallbackSearch(query);
    }

    @Transactional
    public void refreshAllEmbeddings() {
        List<Book> books = bookRepository.findAll();
        for (Book book : books) {
            String text = buildTextForEmbedding(book);
            book.setEmbedding(embeddingService.generateEmbedding(text));
            bookRepository.save(book);
            semanticSearchService.updateBookInCache(book);
        }
        System.out.println("All embeddings refreshed with Descriptions!");
    }
}
