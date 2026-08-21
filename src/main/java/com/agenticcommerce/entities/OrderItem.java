package com.agenticcommerce.entities;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JsonBackReference
    private Orders order;
    @ManyToOne
    private Product product;
    private Integer quantity;
    private Boolean isUpsell; // agent ne suggest kiya tha ya customer ne khud add kiya
}
