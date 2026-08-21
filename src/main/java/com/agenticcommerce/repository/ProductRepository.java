package com.agenticcommerce.repository;

import com.agenticcommerce.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByMerchantId(Long merchantId);
    List<Product> findByPairsWithCategory(String pairsWithCategory);
}