package com.agenticcommerce.controller;

import com.agenticcommerce.entities.Product;
import com.agenticcommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/merchant/{merchantId}")
    public List<Product> getProductsByMerchant(
            @PathVariable Long merchantId
    ) {
        return productRepository.findByMerchantId(merchantId);
    }
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}