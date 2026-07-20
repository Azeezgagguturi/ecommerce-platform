package com.platform.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CartItemResponse(
        UUID productId,
        String productName,
        BigDecimal price,
        Integer quantity,
        String imageUrl,
        BigDecimal subtotal
) {}
