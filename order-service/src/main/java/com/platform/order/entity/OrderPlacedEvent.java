package com.platform.order.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record OrderPlacedEvent(
        UUID orderId,
        UUID productId,
        String productName,
        String customerEmail,
        String customerName,
        Integer quantity,
        BigDecimal totalPrice,
        String status,
        LocalDateTime placedAt
) {}
