package com.platform.order.service;

import com.platform.order.dto.*;
import com.platform.order.entity.Cart;
import com.platform.order.entity.CartItem;
import com.platform.order.entity.OrderPlacedEvent;
import com.platform.order.exception.CartEmptyException;
import com.platform.order.kafka.OrderEventProducer;
import com.platform.order.repository.CartRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final CartRepository cartRepository;
    private final OrderEventProducer orderEventProducer;

    public OrderService(CartRepository cartRepository, OrderEventProducer orderEventProducer) {
        this.cartRepository = cartRepository;
        this.orderEventProducer = orderEventProducer;
    }

    public CartResponse getCart(String sessionId) {
        Cart cart = cartRepository.findById(sessionId)
                .orElse(new Cart(sessionId, null));

        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getProductId(),
                        item.getProductName(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getImageUrl(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .toList();

        return new CartResponse(
                cart.getSessionId(),
                cart.getUserId(),
                itemResponses,
                cart.getTotalAmount()
        );
    }

    public CartResponse addToCart(AddToCartRequest request) {
        Cart cart = cartRepository.findById(request.getSessionId())
                .orElse(new Cart(request.getSessionId(), request.getUserId()));

        BigDecimal price = new BigDecimal(request.getProductPrice());

        boolean itemExists = false;
        for (CartItem item : cart.getItems()) {
            if (item.getProductId().equals(request.getProductId())) {
                item.setQuantity(item.getQuantity() + request.getQuantity());
                itemExists = true;
                break;
            }
        }

        if (!itemExists) {
            CartItem newItem = new CartItem(
                    request.getProductId(),
                    request.getProductName(),
                    price,
                    request.getQuantity(),
                    request.getImageUrl()
            );
            cart.getItems().add(newItem);
        }

        cart.recalculateTotal();
        cartRepository.save(cart);

        log.info("Item added to cart {}: {} x{} (total: {})",
                sessionId(request.getSessionId()), request.getProductName(),
                request.getQuantity(), cart.getTotalAmount());

        return getCart(request.getSessionId());
    }

    public CartResponse removeFromCart(String sessionId, UUID productId) {
        Cart cart = cartRepository.findById(sessionId)
                .orElseThrow(() -> new CartEmptyException("Cart is empty"));

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        cart.recalculateTotal();
        cartRepository.save(cart);

        return getCart(sessionId);
    }

    public CartResponse updateCartItemQuantity(String sessionId, UUID productId, int quantity) {
        Cart cart = cartRepository.findById(sessionId)
                .orElseThrow(() -> new CartEmptyException("Cart is empty"));

        for (CartItem item : cart.getItems()) {
            if (item.getProductId().equals(productId)) {
                if (quantity <= 0) {
                    cart.getItems().remove(item);
                } else {
                    item.setQuantity(quantity);
                }
                break;
            }
        }

        cart.recalculateTotal();
        cartRepository.save(cart);

        return getCart(sessionId);
    }

    public CheckoutResponse checkout(CheckoutRequest request) {
        Cart cart = cartRepository.findById(request.getSessionId())
                .orElseThrow(() -> new CartEmptyException("Cart not found. Add items first."));

        if (cart.getItems().isEmpty()) {
            throw new CartEmptyException("Cannot checkout with an empty cart");
        }

        UUID orderId = UUID.randomUUID();

        for (CartItem item : cart.getItems()) {
            OrderPlacedEvent event = new OrderPlacedEvent(
                    orderId,
                    item.getProductId(),
                    item.getProductName(),
                    request.getCustomerEmail(),
                    request.getCustomerName(),
                    item.getQuantity(),
                    item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())),
                    "PLACED",
                    LocalDateTime.now()
            );

            orderEventProducer.sendOrderPlacedEvent(event);
        }

        cartRepository.delete(cart);

        log.info("Checkout completed for session {}: order={}, total={}, items={}",
                sessionId(request.getSessionId()), orderId, cart.getTotalAmount(), cart.getItems().size());

        return new CheckoutResponse(
                orderId,
                "PLACED",
                cart.getTotalAmount(),
                "Order placed successfully. Confirmation will be sent to " + request.getCustomerEmail(),
                LocalDateTime.now()
        );
    }

    private String sessionId(String sid) {
        return sid.length() > 8 ? sid.substring(0, 8) + "..." : sid;
    }
}
