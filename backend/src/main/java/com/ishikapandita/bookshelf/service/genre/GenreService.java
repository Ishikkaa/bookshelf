package com.ishikapandita.bookshelf.service.genre;

import com.ishikapandita.bookshelf.model.Genre;
import com.ishikapandita.bookshelf.repository.GenreRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GenreService implements IGenreService {
    private final GenreRepository genreRepository;

    @Override
    public Genre addGenre(Genre genre) {
        return Optional.of(genre)
                .filter(g -> !genreRepository.existsByName(g.getName()))
                .map(genreRepository::save)
                .orElseThrow(() -> new EntityExistsException(genre.getName() + " already exists!"));
    }

    @Override
    public Genre updateGenre(Genre genre, Long genreId) {
        return Optional.ofNullable(findGenreById(genreId)).map(oldGenre -> {
            oldGenre.setName(genre.getName());
            return genreRepository.save(oldGenre);
        }).orElseThrow(() -> new EntityNotFoundException("Genre not found!"));
    }

    @Override
    public void deleteGenre(Long genreId) {
        genreRepository.findById(genreId)
                .ifPresentOrElse(genreRepository::delete, () -> {
                    throw new EntityNotFoundException("Genre not found!");
                });
    }

    @Override
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @Override
    public Genre findGenreByName(String name) {
        return genreRepository.findByName(name);
    }

    @Override
    public Genre findGenreById(Long genreId) {
        return genreRepository.findById(genreId)
                .orElseThrow(() -> new EntityNotFoundException("Genre not found"));
    }
}
