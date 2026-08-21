package com.agenticcommerce.controller;

import com.agenticcommerce.entities.Orders;
import com.agenticcommerce.repository.OrdersRepository;
import com.agenticcommerce.service.AgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/webhook")
public class WebhookController {

    @Autowired private OrdersRepository ordersRepository;
    @Autowired private AgentService agentService;   // <-- NEW

    @PostMapping("/razorpay")
    @SuppressWarnings("unchecked")
    public String handleWebhook(@RequestBody Map<String, Object> payload) {
        String event = (String) payload.get("event");
        Map<String, Object> payloadEntity = (Map<String, Object>) payload.get("payload");
        Map<String, Object> paymentEntity = (Map<String, Object>) ((Map<String, Object>) payloadEntity.get("payment")).get("entity");

        String razorpayOrderId = (String) paymentEntity.get("order_id");

        Orders order = ordersRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("payment.captured".equals(event)) {
            order.setStatus("PAID");
            ordersRepository.save(order);
        } else if ("payment.failed".equals(event)) {
            order.setStatus("FAILED");
            ordersRepository.save(order);
            agentService.handlePaymentFailure(order);   // <-- NEW: agent gracefully handle karega
        }

        return "handled";
    }
}