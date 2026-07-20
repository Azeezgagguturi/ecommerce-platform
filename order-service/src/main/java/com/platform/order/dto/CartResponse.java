package com.platform.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CartResponse(
        String sessionId,
        UUID userId,
        java.util.List<CartItemResponse> items,
        BigDecimal totalAmount
) {}
