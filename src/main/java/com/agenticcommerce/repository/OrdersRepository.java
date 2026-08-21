package com.agenticcommerce.repository;


import com.agenticcommerce.entities.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    Optional<Orders> findByRazorpayOrderId(String razorpayOrderId);
}