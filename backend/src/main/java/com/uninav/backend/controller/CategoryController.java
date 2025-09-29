package com.uninav.backend.controller;

import com.uninav.backend.model.Category;
import com.uninav.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/get-all-categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.status(HttpStatus.OK).body(categories);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("add-category")
    public ResponseEntity<String> addCategory(@RequestBody Category category) {
        try {
            if (categoryService.isCategoryNameExists(category.getName())){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Category name already exists");
            }
            categoryService.createCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body("Category created");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("delete-category")
    public ResponseEntity<String> deleteCategory(@RequestBody String categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.status(HttpStatus.OK).body("Category deleted");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
