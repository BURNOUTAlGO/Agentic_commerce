package com.agenticcommerce.entities;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double price;
    private String category;      // e.g. "phone", "accessory"
    private String pairsWithCategory; // e.g. phone -> accessory (upsell logic ke liye)
    @ManyToOne
    private Merchant merchant;
}