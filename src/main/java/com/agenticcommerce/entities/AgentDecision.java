package com.agenticcommerce.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AgentDecision {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JsonIgnoreProperties({"items", "merchant"})
    private Orders order;
    private String decisionType;   // "UPSELL_SUGGESTED", "DISCOUNT_OFFERED", "PAYMENT_RETRY"
    private String reasoning;      // human-readable: "Suggested case cover because phone was added"
    private Double proposedValue;  // discount amount / suggested item price
    private Boolean requiresApproval;
    private String approvalStatus; // PENDING, APPROVED, REJECTED, AUTO_APPROVED
    private LocalDateTime timestamp;
}