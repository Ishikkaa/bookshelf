import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getBookById, updateBook } from "../../store/features/BookSlice";
import { getAllGenres } from "../../store/features/GenreSlice";
import { Stepper, Step, StepLabel } from "@mui/material";
import ImageUploader from "./ImageUploader";

const BookUpdate = () => {
  const dispatch = useDispatch();
  const { bookId } = useParams();
  const { genres } = useSelector((state) => state.genre);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Update Book", "Upldate Book Cover"];
  
  const [updatedBook, setUpdatedBook] = useState({
    title: "",
    author: "",
    price: "",
    isbn: "",
    inventory: "",
    description: "",
    genre: { name: "" },
    images: [],
  });

  useEffect(() => {
    dispatch(getAllGenres());
  }, [dispatch]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const result = await dispatch(getBookById(bookId)).unwrap()
        setUpdatedBook(result)
      } catch (error) {
        toast.error(error.message)
      }
    };
    fetchBook()
  }, [dispatch, bookId])
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre") {
      setUpdatedBook({
        ...updatedBook,
        genre: { name: value },
      });
    } else {
      setUpdatedBook({
        ...updatedBook,
        [name]: value,
      });
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        updateBook({ bookId, updatedBook })
      ).unwrap();
      toast.success("Book updated Successfully!");
    } catch (error) {
      toast.error("Book not updated. Try again later!");
    }
  };

  const imageId = updatedBook.images?.length
    ? updatedBook.images[0].id
    : null;

  return (
    <section className="manage-page">
      <ToastContainer />

      <div className="container py-5">
        <h2 className="genre-heading text-center mb-4">Update Book</h2>

        {/* STEPPER */}
        <Stepper activeStep={activeStep} className="mb-4">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="add-book-card shadow-sm">
          {activeStep === 0 && (
            <form onSubmit={handleUpdateBook}>
              {/* Title */}
              <div className="form-group mb-3">
                <label>Book Title</label>
                <input
                  type="text"
                  name="title"
                  value={updatedBook.title}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Author */}
              <div className="form-group mb-3">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={updatedBook.author}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Price */}
              <div className="form-group mb-3">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={updatedBook.price}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* ISBN */}
              <div className="form-group mb-3">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={updatedBook.isbn}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Inventory */}
              <div className="form-group mb-3">
                <label>Inventory</label>
                <input
                  type="number"
                  name="inventory"
                  value={updatedBook.inventory}
                  onChange={handleChange}
                  className="form-control"
                  min={1}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group mb-4">
                <label>Description</label>
                <textarea
                  name="description"
                  value={updatedBook.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                />
              </div>

              {/* Genre */}
              <div className="form-group mb-4">
                <label>Genre</label>
                <select
                  name="genre"
                  value={updatedBook.genre?.name || ""}
                  onChange={handleChange}
                  className="form-control genre-dropdown"
                  required>
                  <option value="" disabled>
                    Select a genre
                  </option>

                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-grid mt-3">
                <button type="submit" className="btn custom-checkout-btn">
                  Save Book Details
                </button>
              </div>
              <div className="d-grid mt-3">
                <button type="button" className="btn custom-checkout-btn"
                onClick={() => setActiveStep(1)}>
                  Skip to Image Update
                </button>
              </div>
            </form>
          )}
          {activeStep === 1 && (
            <div className="text-center">
              <ImageUploader
                bookId={bookId}    
                imageId={imageId} 
                onBack={() => setActiveStep(0)} 
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookUpdate;
