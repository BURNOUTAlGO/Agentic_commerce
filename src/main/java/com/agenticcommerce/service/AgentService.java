package com.agenticcommerce.service;

import com.agenticcommerce.entities.*;
import com.agenticcommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AgentService {

    @Autowired private ProductRepository productRepository;
    @Autowired private AgentPolicyRepository agentPolicyRepository;
    @Autowired private AgentDecisionRepository agentDecisionRepository;

    public void runAgentOnOrder(Orders order, List<Product> cartProducts) {

        AgentPolicy policy = agentPolicyRepository.findByMerchantId(order.getMerchant().getId())
                .orElseThrow(() -> new RuntimeException("No policy set for merchant"));

        // --- UPSELL SUGGESTION ---
        for (Product cartProduct : cartProducts) {
            if (cartProduct.getPairsWithCategory() != null) {
                List<Product> suggestions = productRepository.findByCategory(cartProduct.getPairsWithCategory());

                for (Product suggestion : suggestions) {
                    boolean alreadyInCart = cartProducts.stream()
                            .anyMatch(p -> p.getId().equals(suggestion.getId()));
                    if (alreadyInCart) continue;

                    String reasoning = "Customer ne '" + cartProduct.getName() + "' (" + cartProduct.getCategory()
                            + ") liya hai. '" + suggestion.getName() + "' isके saath commonly kharida jaata hai, "
                            + "isliye upsell suggest kiya gaya.";

                    logDecision(order, "UPSELL_SUGGESTED", reasoning, suggestion.getPrice(), policy);
                }
            }
        }

        // --- DISCOUNT DECISION ---
        double discountPercent = 0.0;
        String discountReason = "";

        if (order.getTotalAmount() > 50000) {
            discountPercent = 10.0;
            discountReason = "Order value ₹" + order.getTotalAmount() + " > ₹50,000 hai, isliye 10% loyalty discount offer kiya gaya.";
        } else if (order.getTotalAmount() > 20000) {
            discountPercent = 5.0;
            discountReason = "Order value ₹" + order.getTotalAmount() + " > ₹20,000 hai, isliye 5% discount offer kiya gaya.";
        }

        if (discountPercent > 0) {
            if (discountPercent > policy.getMaxDiscountPercent()) {
                discountReason += " (Policy max " + policy.getMaxDiscountPercent() + "% hai, isliye cap kiya gaya.)";
                discountPercent = policy.getMaxDiscountPercent();
            }

            double discountValue = (order.getTotalAmount() * discountPercent) / 100;
            logDecision(order, "DISCOUNT_OFFERED", discountReason, discountValue, policy);
        }
    }

    private void logDecision(Orders order, String type, String reasoning, Double value, AgentPolicy policy) {
        AgentDecision decision = new AgentDecision();
        decision.setOrder(order);
        decision.setDecisionType(type);
        decision.setReasoning(reasoning);
        decision.setProposedValue(value);
        decision.setTimestamp(LocalDateTime.now());

        if (value != null && value > policy.getMaxAutoApproveValue()) {
            decision.setRequiresApproval(true);
            decision.setApprovalStatus("PENDING");
        } else {
            decision.setRequiresApproval(false);
            decision.setApprovalStatus("AUTO_APPROVED");
        }

        agentDecisionRepository.save(decision);
    }
    // AgentService.java mein add karo (existing methods ke saath)

    public void handlePaymentFailure(Orders order) {
        AgentPolicy policy = agentPolicyRepository.findByMerchantId(order.getMerchant().getId())
                .orElseThrow(() -> new RuntimeException("No policy set for merchant"));

        String reasoning = "Payment fail hua order #" + order.getId() + " ke liye (amount ₹" + order.getTotalAmount() + "). " +
                "Customer ko retry encourage karne ke liye ek chhota recovery discount offer kiya gaya, taaki checkout drop-off kam ho.";

        // Recovery discount: chhota, fixed 5% (policy se bounded)
        double recoveryDiscountPercent = Math.min(5.0, policy.getMaxDiscountPercent());
        double recoveryValue = (order.getTotalAmount() * recoveryDiscountPercent) / 100;

        logDecision(order, "PAYMENT_RETRY_OFFERED", reasoning, recoveryValue, policy);
    }
}