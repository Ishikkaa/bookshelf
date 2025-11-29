package com.ishikapandita.bookshelf.service.image;

import com.ishikapandita.bookshelf.dtos.ImageDto;
import com.ishikapandita.bookshelf.model.Book;
import com.ishikapandita.bookshelf.model.Image;
import com.ishikapandita.bookshelf.repository.ImageRepository;
import com.ishikapandita.bookshelf.service.book.IBookService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
    private final ImageRepository imageRepository;
    private final IBookService bookService;

    @Override
    public Image getImageById(Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found!"));
    }

    @Override
    public void deleteImageById(Long imageId) {
        imageRepository.findById(imageId).ifPresentOrElse(imageRepository::delete, () -> {
            throw new EntityNotFoundException("Image not found!");
        });
    }

    @Override
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = getImageById(imageId);
        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepository.save(image);

        } catch (IOException | SQLException e) {
            throw new RuntimeException("Failed to update image: " + e.getMessage());
        }
    }

    @Override
    public List<ImageDto> saveImages(Long bookId, List<MultipartFile> files) {
        Book book = bookService.getBookById(bookId);

        List<ImageDto> savedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                Image image = new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setBook(book);

                String buildDownloadUrl = "/api/v1/images/image/download/";
                String downloadUrl = buildDownloadUrl + image.getId();
                image.setDownloadURL(downloadUrl);
                Image savedImage = imageRepository.save(image);
                savedImage.setDownloadURL(buildDownloadUrl + savedImage.getId());
                imageRepository.save(savedImage);

                ImageDto imageDto = new ImageDto();
                imageDto.setId(savedImage.getId());
                imageDto.setFileName(savedImage.getFileName());
                imageDto.setDownloadUrl(savedImage.getDownloadURL());
                savedImages.add(imageDto);
            } catch (IOException | SQLException e) {
                throw new RuntimeException("Failed to save images: " + e.getMessage());
            }
        }
        return savedImages;
    }
}
