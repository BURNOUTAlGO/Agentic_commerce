package com.agenticcommerce.controller;


import com.agenticcommerce.entities.Orders;
import com.agenticcommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class OrderController {

    @Autowired private OrderService orderService;

    @PostMapping("/create")
    public Orders createOrder(@RequestBody Map<String, Object> request) throws Exception {
        Long merchantId = Long.valueOf(request.get("merchantId").toString());
        List<Long> productIds = ((List<?>) request.get("productIds")).stream()
                .map(o -> Long.valueOf(o.toString())).toList();
        List<Integer> quantities = ((List<?>) request.get("quantities")).stream()
                .map(o -> Integer.valueOf(o.toString())).toList();

        return orderService.createOrder(merchantId, productIds, quantities);
    }
    @GetMapping("/{orderId}")
    public Orders getOrder(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }
}