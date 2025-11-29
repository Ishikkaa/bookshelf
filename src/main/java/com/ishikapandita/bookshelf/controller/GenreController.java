package com.ishikapandita.bookshelf.controller;

import com.ishikapandita.bookshelf.model.Genre;
import com.ishikapandita.bookshelf.response.ApiResponse;
import com.ishikapandita.bookshelf.service.genre.IGenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/genres")
public class GenreController {
    private final IGenreService genreService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllGenres(){
        List<Genre> genres = genreService.getAllGenres();
        return ResponseEntity.ok(new ApiResponse("Found", genres));
    }
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addGenre(@RequestBody Genre genre) {
        Genre theGenre= genreService.addGenre(genre);
        return ResponseEntity.ok(new ApiResponse("Success", theGenre));
    }

    @GetMapping("/genre/{id}/genre")
    public ResponseEntity<ApiResponse> getGenreById(@PathVariable Long id) {
        Genre theGenre = genreService.findGenreById(id);
        return ResponseEntity.ok(new ApiResponse("Success", theGenre));
    }

    @GetMapping("/genre/{name}/genre")
    public ResponseEntity<ApiResponse> getGenreByName(@PathVariable String name) {
        Genre theGenre = genreService.findGenreByName(name);
        return ResponseEntity.ok(new ApiResponse("Found", theGenre));
    }

    @PutMapping("/genre/{id}/update")
    public ResponseEntity<ApiResponse> updateGenre(@PathVariable Long id, @RequestBody Genre genre) {
        Genre updatedGenre = genreService.updateGenre(genre, id);
        return ResponseEntity.ok(new ApiResponse("Update success!", updatedGenre));
    }

    @DeleteMapping("/genre/{id}/delete")
    public ResponseEntity<ApiResponse> deleteGenre(@PathVariable Long id) {
        genreService.deleteGenre(id);
        return ResponseEntity.ok(new ApiResponse("Found", null));
    }
}
