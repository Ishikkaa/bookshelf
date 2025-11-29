package com.ishikapandita.bookshelf.service.genre;

import com.ishikapandita.bookshelf.model.Genre;

import java.util.List;

public interface IGenreService {
    Genre addGenre(Genre genre);
    Genre updateGenre(Genre genre, Long genreId);
    void deleteGenre(Long genreId);
    List<Genre> getAllGenres();
    Genre findGenreByName(String name);
    Genre findGenreById(Long genreId);
}
