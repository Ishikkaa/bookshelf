import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookImage from "../utils/BookImage";
import { getAllBooks } from "../../store/features/BookSlice";
import { addToCart } from "../../store/features/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const BookDetails = () => {
  const { title } = useParams();
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(getAllBooks());
    }
  }, [dispatch, books.length]);

  useEffect(() => {
    if (books.length > 0) {
      const found = books.find(
        (b) => b.title.toLowerCase() === title.toLowerCase()
      );
      setBook(found || null);
    }
  }, [books, title]);

  if (!book) return <div className="details-loading">Loading...</div>;

  const handleAddToCart = () => {
    dispatch(addToCart({ bookId: book.id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success("Added to cart!"))
      .catch(() => toast.error("Failed to add to cart. Try again!"));
  };

  return (
    <div className="book-details-page">
      <ToastContainer />

      <div className="details-left">
        <div className="details-book-card">
          {book.images?.length > 0 && (
            <BookImage
              bookId={book.images[0].id}
              className="details-book-img"
            />
          )}
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="details-right">
        <h2 className="details-title">{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Price:</strong> ₹{book.price}</p>
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Genre:</strong> {book.genre?.name}</p>
        <p><strong>Description:</strong> {book.description}</p>

        {/* TROPES */}
        {book.tropes?.length > 0 && (
          <div className="details-chip-section">
            <strong>Tropes:</strong>
            <div className="chip-container">
              {book.tropes.map((trope) => (
                <span key={trope} className="chip">
                  {trope}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* THEMES */}
        {book.themes?.length > 0 && (
          <div className="details-chip-section">
            <strong>Themes:</strong>
            <div className="chip-container">
              {book.themes.map((theme) => (
                <span key={theme} className="chip">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
