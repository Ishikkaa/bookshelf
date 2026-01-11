import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { MdEdit, MdDelete } from "react-icons/md";

import Paginator from "../common/Paginator";
import SideBar from "../common/SideBar";
import BookImage from "../utils/BookImage";
import DeleteBookModal from "../manage/DeleteBookModal";

import {
  getAllBooks,
  deleteBook,
  semanticSearch
} from "../../store/features/BookSlice";

const BrowseLibrary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { books, semanticResults, errorMessage } = useSelector(
    (state) => state.book
  );
  const { searchQuery } = useSelector((state) => state.search);
  const roles = useSelector((state) => state.auth.roles);
  const isAdmin = roles?.includes("ROLE_ADMIN");

  const [isSemanticMode, setIsSemanticMode] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const genreFromURL = params.get("genre");

  const [selectedGenres, setSelectedGenres] = useState(() =>
    genreFromURL ? [genreFromURL] : []
  );
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  // --- FETCH BOOKS ---
  useEffect(() => {
    dispatch(getAllBooks());
  }, [dispatch]);

  // --- ERROR HANDLING ---
  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  // --- UI FILTERING + SEARCH MODE DECISION ---
  useEffect(() => {
    if (!Array.isArray(books)) return;

    let filtered = [...books];

    if (genreFromURL) {
      filtered = filtered.filter(
        (book) =>
          book.genre?.name?.toLowerCase() === genreFromURL.toLowerCase()
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((book) =>
        selectedGenres.includes(book.genre?.name)
      );
    }

    if (selectedAuthors.length > 0) {
      filtered = filtered.filter((book) =>
        selectedAuthors.includes(book.author)
      );
    }

    const trimmedQuery = searchQuery.trim();
    const words = trimmedQuery.split(/\s+/);

    // --- NO SEARCH ---
    if (trimmedQuery === "") {
      setIsSemanticMode(false);
      setFilteredBooks(filtered);
      setCurrentPage(1);
      return;
    }

    // --- NORMAL TITLE SEARCH ---
    if (words.length < 3) {
      setIsSemanticMode(false);
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
      setCurrentPage(1);
      return;
    }

    // --- SEMANTIC SEARCH ---
    setIsSemanticMode(true);
    dispatch(semanticSearch(trimmedQuery));
  }, [
    books,
    genreFromURL,
    selectedGenres,
    selectedAuthors,
    searchQuery,
    dispatch
  ]);

  // --- SEMANTIC RESULTS HANDLER ---
  useEffect(() => {
    if (isSemanticMode) {
      setFilteredBooks(Array.isArray(semanticResults) ? semanticResults : []);
      setCurrentPage(1);
    }
  }, [semanticResults, isSemanticMode]);

  // --- SAFE PAGINATION ---
  const safeFilteredBooks = Array.isArray(filteredBooks)
    ? filteredBooks
    : [];

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = safeFilteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  // --- DELETE MODAL ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (!bookToDelete) return;

    dispatch(deleteBook(bookToDelete.id))
      .unwrap()
      .then(() => toast.success("Book deleted successfully"))
      .catch((err) => toast.error(err || "Failed to delete book"))
      .finally(() => {
        setShowDeleteModal(false);
        setBookToDelete(null);
      });
  };

  useEffect(() => {
    console.log("Semantic mode:", isSemanticMode);
    console.log("Semantic results from store:", semanticResults);
  }, [semanticResults, isSemanticMode]);

  return (
    <div className="library-page">
      <ToastContainer />

      <div className="library-container">
        {/* LEFT SIDEBAR */}
        <SideBar
          books={books}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          selectedAuthors={selectedAuthors}
          setSelectedAuthors={setSelectedAuthors}
        />

        {/* RIGHT SECTION */}
        <div className="books-section">
          {isSemanticMode && (
            <div className="semantic-hint">
              Showing results based on meaning ✨
            </div>
          )}

          <div className="books-grid">
            {currentBooks.map((book) => (
              <div className="book-card-wrapper" key={book.id}>
                <div className="book-card-container">
                  {isAdmin && (
                    <div className="book-actions">
                      <button
                        className="book-action-btn edit"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/manage/books/${book.id}/edit`);
                        }}
                      >
                        <MdEdit />
                      </button>

                      <button
                        className="book-action-btn delete"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setBookToDelete(book);
                          setShowDeleteModal(true);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}

                  <Link
                    to={`/library/books/${book.title}`}
                    className="book-card"
                  >
                    <div className="book-image-wrapper">
                      {book.images?.length > 0 && (
                        <BookImage
                          bookId={book.images[0].id}
                          className="book-card-img"
                        />
                      )}
                    </div>

                    <div className="book-overlay">
                      <span className="book-title">{book.title}</span>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center pagination-wrapper">
        <Paginator
          itemsPerPage={itemsPerPage}
          totalItems={safeFilteredBooks.length}
          currentPage={currentPage}
          paginate={setCurrentPage}
        />
      </div>

      <DeleteBookModal
        isOpen={showDeleteModal}
        bookTitle={bookToDelete?.title}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BrowseLibrary;
