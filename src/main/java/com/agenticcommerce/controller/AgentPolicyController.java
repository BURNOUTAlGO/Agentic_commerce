package com.agenticcommerce.controller;


import com.agenticcommerce.entities.AgentPolicy;
import com.agenticcommerce.entities.Merchant;
import com.agenticcommerce.repository.AgentPolicyRepository;
import com.agenticcommerce.repository.MerchantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agent/policy")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AgentPolicyController {

    @Autowired
    private AgentPolicyRepository agentPolicyRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @GetMapping("/merchant/{merchantId}")
    public AgentPolicy getPolicy(
            @PathVariable Long merchantId
    ) {
        return agentPolicyRepository
                .findByMerchantId(merchantId)
                .orElseThrow(() ->
                        new RuntimeException("Policy not found")
                );
    }

    @PostMapping("/merchant/{merchantId}")
    public AgentPolicy savePolicy(
            @PathVariable Long merchantId,
            @RequestBody AgentPolicy policy
    ) {

        Merchant merchant = merchantRepository
                .findById(merchantId)
                .orElseThrow(() ->
                        new RuntimeException("Merchant not found")
                );

        AgentPolicy existingPolicy =
                agentPolicyRepository
                        .findByMerchantId(merchantId)
                        .orElse(new AgentPolicy());

        existingPolicy.setMerchant(merchant);

        existingPolicy.setMaxDiscountPercent(
                policy.getMaxDiscountPercent()
        );

        existingPolicy.setMaxAutoApproveValue(
                policy.getMaxAutoApproveValue()
        );

        return agentPolicyRepository.save(existingPolicy);
    }
}