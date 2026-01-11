import React, { useState, useEffect } from "react";

const BookImage = ({ bookId, className }) =>  {
  const [bookImg, setBookImg] = useState(null);

  useEffect(() => {
    const fetchBookImage = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:9090/api/v1/images/image/download/${id}`
        );
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBookImg(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (bookId) {
      fetchBookImage(bookId);
    }
  }, [bookId]);

  if (!bookImg) return null;

  return (
    <div>
      <img
      src={bookImg}
      alt="Book Cover"
      className={className}
      />
    </div>
  )
}

export default BookImage