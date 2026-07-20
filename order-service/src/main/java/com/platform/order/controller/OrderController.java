package com.platform.order.controller;

import com.platform.order.dto.*;
import com.platform.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/cart/{sessionId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable String sessionId) {
        return ResponseEntity.ok(orderService.getCart(sessionId));
    }

    @PostMapping("/cart")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.addToCart(request));
    }

    @DeleteMapping("/cart/{sessionId}/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable String sessionId,
            @PathVariable UUID productId) {
        return ResponseEntity.ok(orderService.removeFromCart(sessionId, productId));
    }

    @PutMapping("/cart/{sessionId}/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable String sessionId,
            @PathVariable UUID productId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(orderService.updateCartItemQuantity(sessionId, productId, quantity));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.checkout(request));
    }
}
