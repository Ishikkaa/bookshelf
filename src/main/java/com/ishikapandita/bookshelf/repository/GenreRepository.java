package com.ishikapandita.bookshelf.repository;

import com.ishikapandita.bookshelf.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
public interface GenreRepository extends JpaRepository<Genre, Long>{

    Genre findByName(String name);

    boolean existsByName(String name);

}
