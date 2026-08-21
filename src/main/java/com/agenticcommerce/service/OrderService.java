package com.agenticcommerce.service;

import com.agenticcommerce.entities.Merchant;
import com.agenticcommerce.entities.OrderItem;
import com.agenticcommerce.entities.Orders;
import com.agenticcommerce.entities.Product;
import com.agenticcommerce.repository.MerchantRepository;
import com.agenticcommerce.repository.OrderItemRepository;
import com.agenticcommerce.repository.OrdersRepository;
import com.agenticcommerce.repository.ProductRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private RazorpayClient razorpayClient;
    @Autowired private OrdersRepository ordersRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private MerchantRepository merchantRepository;
    @Autowired private AgentService agentService;   // <-- NEW

    public Orders createOrder(Long merchantId, List<Long> productIds, List<Integer> quantities) throws Exception {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        double totalAmount = 0.0;
        Orders order = new Orders();
        order.setMerchant(merchant);
        order.setStatus("CREATED");
        order.setCreatedAt(LocalDateTime.now());
        order = ordersRepository.save(order);

        List<Product> cartProducts = new ArrayList<>();   // <-- NEW

        for (int i = 0; i < productIds.size(); i++) {
            Product product = productRepository.findById(productIds.get(i))
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            int qty = quantities.get(i);
            totalAmount += product.getPrice() * qty;
            cartProducts.add(product);   // <-- NEW

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(qty);
            item.setIsUpsell(false);
            orderItemRepository.save(item);
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (totalAmount * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_rcpt_" + order.getId());

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        order.setRazorpayOrderId(razorpayOrder.get("id"));
        order.setTotalAmount(totalAmount);
        order = ordersRepository.save(order);

        agentService.runAgentOnOrder(order, cartProducts);   // <-- NEW: agent yahan chalega

        return order;
    }
    public Orders getOrder(Long orderId) {
        return ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}