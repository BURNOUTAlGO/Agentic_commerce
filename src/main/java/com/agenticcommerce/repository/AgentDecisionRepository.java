package com.agenticcommerce.repository;


import com.agenticcommerce.entities.AgentDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentDecisionRepository extends JpaRepository<AgentDecision, Long> {
    List<AgentDecision> findByOrderId(Long orderId);
    List<AgentDecision> findByApprovalStatus(String approvalStatus);
}
