package com.ishikapandita.bookshelf.service.image;

import com.ishikapandita.bookshelf.dtos.ImageDto;
import com.ishikapandita.bookshelf.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {

    Image getImageById(Long imageId);
    void deleteImageById(Long imageId);
    void updateImage(MultipartFile file, Long imageId);
    List<ImageDto> saveImages(Long bookId, List<MultipartFile> files);
}
