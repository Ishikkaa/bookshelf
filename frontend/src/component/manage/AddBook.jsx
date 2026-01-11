import React, { useState , useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewBook } from "../../store/features/BookSlice";
import { getAllGenres } from "../../store/features/GenreSlice";
import { toast, ToastContainer } from "react-toastify";
import { Stepper, Step, StepLabel } from "@mui/material";
import ImageUploader from "./ImageUploader";

const AddBook = () => {
  const dispatch = useDispatch();
  const [bookId, setBookId] = useState(null);
  const { genres } = useSelector((state) => state.genre);
  const imageId = null;
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Add New Book", "Upload Book Cover"];

  console.log("genres in add book: " , genres);
  const [book, setBook] = React.useState({
    title: "",
    author: "",
    price: "",
    isbn: "",
    inventory: "",
    description: "", 
    genre: "",
    tropes: [],
    themes: []
  });

  useEffect(() => {
      dispatch(getAllGenres());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddNewBook = async (e) => {
    e.preventDefault();
    try {
      if (!book.tropes.length) {
        toast.error("Please add at least one trope");
        return;
      }
      if (!book.themes.length) {
        toast.error("Please add at least one theme");
        return;
      }
      // const result = await dispatch(addNewBook(book)).unwrap();
      const payload = {
        ...book,
        price: Number(book.price),
        inventory: Number(book.inventory),
        genre: { name: book.genre }
      };
      const result = await dispatch(addNewBook(payload)).unwrap();
      console.log("The add book result : ", result);
      setBookId(result.id);
      toast.success("Book added successfully!");
      resetForm();
      setActiveStep(1);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setBook({
      title: "",
      author: "",
      price: "",
      isbn: "",
      inventory: "",
      description: "",
      genre: "",
      tropes: [],
      themes: []
    });
  };

  const handleAddTag = (field, value) => {
    if (!value.trim()) return;

    setBook(prev => ({
      ...prev,
      [field]: [...prev[field], value.toLowerCase()]
    }));
  };

  const handleRemoveTag = (field, value) => {
    setBook(prev => ({
      ...prev,
      [field]: prev[field].filter(v => v !== value)
    }));
  };

  return (
    <section className="manage-page">
      <ToastContainer />

      <div className="container py-5">
        <h2 className="genre-heading text-center mb-4">Add New Book</h2>

        {/* STEPPER */}
        <Stepper activeStep={activeStep} className="mb-4">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="add-book-card shadow-sm">
          {/* STEP 0 → BOOK DETAILS */}
          {activeStep === 0 && (
            <form onSubmit={handleAddNewBook}>
              {/* Title */}
              <div className="form-group mb-3">
                <label>Book Title</label>
                <input
                  type="text"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter book title"
                  required
                />
              </div>

              {/* Author */}
              <div className="form-group mb-3">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={book.author}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter author name"
                  required
                />
              </div>

              {/* Price */}
              <div className="form-group mb-3">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={book.price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter price"
                  required
                />
              </div>

              {/* ISBN */}
              <div className="form-group mb-3">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={book.isbn}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter ISBN"
                  required
                />
              </div>

              {/* Inventory */}
              <div className="form-group mb-3">
                <label>Inventory</label>
                <input
                  type="number"
                  name="inventory"
                  value={book.inventory}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter inventory"
                  min={1}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  value={book.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Short description about the book"
                />
              </div>

              <div className="form-group mb-3">
                <label>Tropes</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a trope and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag("tropes", e.target.value);
                      e.target.value = "";
                    }
                  }}
                />

                <div className="mt-2">
                  {book.tropes.map(trope => (
                    <span key={trope} className="custom-chip">
                      {trope}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        onClick={() => handleRemoveTag("tropes", trope)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Themes</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a theme and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag("themes", e.target.value);
                      e.target.value = "";
                    }
                  }}
                />

                <div className="mt-2">
                  {book.themes.map(theme => (
                    <span key={theme} className="custom-chip">
                      {theme}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        onClick={() => handleRemoveTag("themes", theme)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div className="form-group mb-3">
                <label>Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={book.genre}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter genre (new or existing)"
                  required
                />
              </div>

              <div className="d-grid mt-3">
                <button type="submit" className="btn custom-checkout-btn">
                  Save Book Details
                </button>
              </div>
            </form>
          )}

          {/* STEP 1 IMAGE UPLOAD*/}
          {activeStep === 1 && (
            <div className="text-center">
              <ImageUploader 
                bookId={bookId}   
                imageId={null} 
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddBook;
