package com.agenticcommerce.repository;


import com.agenticcommerce.entities.AgentPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgentPolicyRepository extends JpaRepository<AgentPolicy, Long> {
    Optional<AgentPolicy> findByMerchantId(Long merchantId);
}