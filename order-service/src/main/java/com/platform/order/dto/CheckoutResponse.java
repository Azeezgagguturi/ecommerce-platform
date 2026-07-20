package com.platform.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CheckoutResponse(
        UUID orderId,
        String status,
        BigDecimal totalAmount,
        String message,
        LocalDateTime timestamp
) {}
