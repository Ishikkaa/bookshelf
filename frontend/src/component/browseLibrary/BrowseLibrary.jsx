import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import Paginator from "../common/Paginator";
import SideBar from "../common/SideBar";
import BookImage from "../utils/BookImage";
import { getAllBooks , deleteBook} from "../../store/features/BookSlice";
import DeleteBookModal from "../manage/DeleteBookModal"

const BrowseLibrary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, errorMessage } = useSelector(
    (state) => state.book
  );
  const { searchQuery } = useSelector((state) => state.search);
  const roles = useSelector((state) => state.auth.roles);
  const isAdmin = roles?.includes("ROLE_ADMIN");

  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const genreFromURL = params.get("genre");

  useEffect(() => {
    dispatch(getAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  const [selectedGenres, setSelectedGenres] = useState(() =>
    genreFromURL ? [genreFromURL] : []
  );
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  useEffect(() => {
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

    filtered = filtered.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [books, genreFromURL, selectedGenres, selectedAuthors, searchQuery]);

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

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
      .then(() => {
        toast.success("Book deleted successfully");
      })
      .catch((err) => {
        toast.error(err || "Failed to delete book");
      })
      .finally(() => {
        setShowDeleteModal(false);
        setBookToDelete(null);
      });
  };

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

        {/* RIGHT: BOOK GRID */}
        <div className="books-section">
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
                            console.log("Edit book:", book.id);
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
                            console.log("Delete book:", book.id);
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
          totalItems={filteredBooks.length}
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
