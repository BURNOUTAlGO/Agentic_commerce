package com.agenticcommerce.entities;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class AgentPolicy {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Merchant merchant;
    private Double maxDiscountPercent;   // e.g. 15%
    private Double maxAutoApproveValue;  // e.g. ₹2000 se upar approval chahiye
}