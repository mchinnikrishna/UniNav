package com.uninav.backend.service;

import com.uninav.backend.model.Category;
import com.uninav.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    public void createCategory(Category category) {
        categoryRepository.save(category);
    }

    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    public boolean isCategoryNameExists(String name) {
        Optional<Category> category = Optional.ofNullable(categoryRepository.findByName(name));
        return category.isPresent();
    }

    public Category getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId).orElse(null);
    }
}
