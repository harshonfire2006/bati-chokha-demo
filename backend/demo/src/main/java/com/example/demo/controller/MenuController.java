package com.example.demo.controller;

import com.example.demo.model.MenuItem;
import com.example.demo.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*") // This is crucial! It lets your frontend talk to your backend.
public class MenuController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @GetMapping("/category/{categoryName}")
    public List<MenuItem> getMenuByCategory(@PathVariable String categoryName) {
        return menuItemRepository.findByCategory(categoryName);
    }
}