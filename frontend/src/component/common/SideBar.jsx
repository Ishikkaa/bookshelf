import { useEffect, useState } from "react";

const SideBar = ({
  books,
  selectedGenres,
  setSelectedGenres,
  selectedAuthors,
  setSelectedAuthors,
}) => {

  const [genreList, setGenreList] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  const [authorSearch, setAuthorSearch] = useState("");

  useEffect(() => {
    const genres = [...new Set(books.map((b) => b.genre.name))];
    const authors = [...new Set(books.map((b) => b.author))];

    setGenreList(genres);
    setAuthorList(authors);
  }, [books]);

  const filteredAuthors = authorList.filter((a) =>
    a.toLowerCase().includes(authorSearch.toLowerCase())
  );

  return (
    <div className="custom-sidebar">

      <h4 className="sidebar-title">Filters</h4>

      <details className="sidebar-section" open>
        <summary className="sidebar-section-title">Genres</summary>

        {genreList.map((genre) => (
          <label key={genre} className="sidebar-checkbox">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() =>
                setSelectedGenres((prev) =>
                  prev.includes(genre)
                    ? prev.filter((g) => g !== genre)
                    : [...prev, genre]
                )
              }
            />
            <span>{genre}</span>
          </label>
        ))}
      </details>

      <details className="sidebar-section" open>
        <summary className="sidebar-section-title">Authors</summary>

        <input
          type="text"
          placeholder="Search author..."
          className="sidebar-search"
          value={authorSearch}
          onChange={(e) => setAuthorSearch(e.target.value)}
        />

        <div className="sidebar-author-list">
          {filteredAuthors.map((author) => (
            <label key={author} className="sidebar-checkbox">
              <input
                type="checkbox"
                checked={selectedAuthors.includes(author)}
                onChange={() =>
                  setSelectedAuthors((prev) =>
                    prev.includes(author)
                      ? prev.filter((a) => a !== author)
                      : [...prev, author]
                  )
                }
              />
              <span>{author}</span>
            </label>
          ))}
        </div>
      </details>

    </div>
  );
};

export default SideBar;
