// import { useState, useRef } from "react";
// import { nanoid } from "nanoid";
// import { uploadImages, updateBookImage } from "../../store/features/ImageSlice";
// import { toast, ToastContainer } from "react-toastify";
// import { BsPlus, BsDash } from "react-icons/bs";
// import { useDispatch } from "react-redux";

// const ImageUploader = ({ bookId }) => {
//   const dispatch = useDispatch();
//   const fileInputRefs = useRef([]);

//   const [images, setImages] = useState([]);
//   const [imageInputs, setImageInputs] = useState([{ id: nanoid() }]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => ({
//       id: nanoid(),
//       name: file.name,
//       file,
//     }));
//     setImages((prevImages) => [...prevImages, ...newImages]);
//   };

//   const handleAddImageInput = () => {
//     setImageInputs((prevInputs) => [...prevInputs, { id: nanoid() }]);
//   };

//   const handleRemoveImageInput = (id) => {
//     setImageInputs(imageInputs.filter((input) => input.id !== id));
//   };

//   const handleImageUpload = async (e) => {
//     e.preventDefault();
//     if (!bookId) {
//       return;
//     }
//     if (Array.isArray(images) && images.length > 0) {
//       try {
//         const result = await dispatch(
//           uploadImages({ bookId, files: images.map((image) => image.file) })
//         ).unwrap();
//         clearFileInputs();
//         toast.success(result.message);
//       } catch (error) {
//         toast.error(error.message);
//       }
//     }
//   };

//   const handleImageUpdate = async (e) => {
//     e.preventDefault();
//     if (!imageId) {
//       return;
//     }
//     if (Array.isArray(images) && images.length > 0) {
//       try {
//         const result = await dispatch(
//           updateBookImage({ imageId, files: images.map((image) => image.file) })
//         ).unwrap();
//         clearFileInputs();
//         toast.success(result.message);
//       } catch (error) {
//         toast.error(error.message);
//       }
//     }
//   };

//   const clearFileInputs = () => {
//     fileInputRefs.current.forEach((input) => {
//       if (input) input.value = null;
//     });
//   };

//   return (
//     <div className="manage-page">
//         <ToastContainer />
//         <div className="container py-5">
//             <h2 className="genre-heading text-center mb-4">
//             Upload Book Cover
//             </h2>

//             <div className="add-book-card shadow-sm">
//             <form onSubmit={handleImageUpload}>

//                 <div className="form-group mb-3">
//                 <label>Book Images</label>

//                 <div className="mb-2">
//                     {imageInputs.map((input, index) => (
//                     <div
//                         key={input.id}
//                         className="d-flex align-items-center mb-2"
//                     >
//                         <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="form-control me-2"
//                         ref={(el) => (fileInputRefs.current[index] = el)}
//                         />

//                         <button
//                         type="button"
//                         className="btn btn-outline-danger btn-sm"
//                         onClick={() => handleRemoveImageInput(input.id)}
//                         >
//                         <BsDash />
//                         </button>
//                     </div>
//                     ))}
//                 </div>

//                 <button
//                     type="button"
//                     className="btn btn-link p-0"
//                     onClick={handleAddImageInput}
//                 >
//                     <BsPlus className="me-1" />
//                     Add More Images
//                 </button>
//                 </div>

//                 {imageInputs.length > 0 && (
//                 <div className="d-grid mt-4">
//                     <button type="submit" className="btn add-book-btn">
//                     Upload Images
//                     </button>
//                 </div>
//                 )}
//             </form>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default ImageUploader;

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { uploadImages, updateBookImage } from "../../store/features/ImageSlice";
import { useNavigate } from "react-router-dom";

const ImageUploader = ({ bookId, imageId , onBack}) => {
  const mode = imageId ? "update" : "upload";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    try {
      let result;

      if (mode === "upload") {
        if (!bookId) {
          toast.error("Book ID missing");
          return;
        }

        result = await dispatch(
          uploadImages({ bookId, files: [image] })
        ).unwrap();
      }

      if (mode === "update") {
        if (!imageId) {
          toast.error("Image ID missing");
          return;
        }

        result = await dispatch(
          updateBookImage({ imageId, file: image })
        ).unwrap();
      }

      toast.success(result.message || "Image saved successfully");
      clearInput();
      setTimeout(() => {
        navigate("/library");
      }, 1200);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const clearInput = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <section className="manage-page">
      <ToastContainer />

      <div className="container py-5">
        <h2 className="genre-heading text-center mb-4">
          {mode === "upload" ? "Upload Book Cover" : "Update Book Cover"}
        </h2>

        <div className="add-book-card shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label>Book Cover Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            <div className="d-grid mt-3">
              <button type="submit" className="btn custom-checkout-btn">
                {mode === "upload" ? "Upload Image" : "Update Image"}
              </button>
            </div>
            {mode === "update" && (
              <div className="d-flex gap-2 mt-3">
                <button type="button" className="btn custom-checkout-btn"
                onClick={onBack}>
                  Back
                </button>
                <button type="button" className="btn custom-checkout-btn"
                  onClick={() => navigate("/library")}>
                  Skip to Library
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ImageUploader;

