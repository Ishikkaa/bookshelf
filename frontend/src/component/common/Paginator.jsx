import React from "react";
import { Pagination } from "react-bootstrap";

const Paginator = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const MAX_VISIBLE = 5;

  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  // Adjust window if near edges
  if (currentPage <= 3) {
    startPage = 2;
    endPage = Math.min(totalPages - 1, MAX_VISIBLE);
  }

  if (currentPage >= totalPages - 2) {
    startPage = Math.max(2, totalPages - (MAX_VISIBLE - 1));
    endPage = totalPages - 1;
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex justify-content-center me-5">
      <Pagination>

        {/* Prev */}
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        />

        {/* First page */}
        <Pagination.Item
          active={currentPage === 1}
          onClick={() => paginate(1)}
        >
          1
        </Pagination.Item>

        {/* Left ellipsis */}
        {startPage > 2 && <Pagination.Ellipsis disabled />}

        {/* Middle pages */}
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        ))}

        {/* Right ellipsis */}
        {endPage < totalPages - 1 && <Pagination.Ellipsis disabled />}

        {/* Last page */}
        {totalPages > 1 && (
          <Pagination.Item
            active={currentPage === totalPages}
            onClick={() => paginate(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        )}

        {/* Next */}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => paginate(currentPage + 1)}
        />

      </Pagination>
    </div>
  );
};

export default Paginator;
