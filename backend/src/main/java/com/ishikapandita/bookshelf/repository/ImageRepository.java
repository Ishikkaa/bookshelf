package com.ishikapandita.bookshelf.repository;


import com.ishikapandita.bookshelf.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long>{
    List<Image> findByBookId(Long id);
}
