package com.agenticcommerce.controller;

import com.agenticcommerce.entities.AgentDecision;
import com.agenticcommerce.repository.AgentDecisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AgentDecisionController {

    @Autowired private AgentDecisionRepository agentDecisionRepository;

    @GetMapping("/decisions/order/{orderId}")
    public List<AgentDecision> getDecisionsByOrder(@PathVariable Long orderId) {
        return agentDecisionRepository.findByOrderId(orderId);
    }

    @GetMapping("/decisions/pending")
    public List<AgentDecision> getPendingApprovals() {
        return agentDecisionRepository.findByApprovalStatus("PENDING");
    }

    // NEW: Merchant approve karta hai
    @PostMapping("/decisions/{decisionId}/approve")
    public AgentDecision approveDecision(@PathVariable Long decisionId) {
        AgentDecision decision = agentDecisionRepository.findById(decisionId)
                .orElseThrow(() -> new RuntimeException("Decision not found"));

        if (!"PENDING".equals(decision.getApprovalStatus())) {
            throw new RuntimeException("Only PENDING decisions can be approved. Current status: " + decision.getApprovalStatus());
        }

        decision.setApprovalStatus("APPROVED");
        return agentDecisionRepository.save(decision);
    }

    // NEW: Merchant reject karta hai
    @PostMapping("/decisions/{decisionId}/reject")
    public AgentDecision rejectDecision(@PathVariable Long decisionId) {
        AgentDecision decision = agentDecisionRepository.findById(decisionId)
                .orElseThrow(() -> new RuntimeException("Decision not found"));

        if (!"PENDING".equals(decision.getApprovalStatus())) {
            throw new RuntimeException("Only PENDING decisions can be rejected. Current status: " + decision.getApprovalStatus());
        }

        decision.setApprovalStatus("REJECTED");
        return agentDecisionRepository.save(decision);
    }
}