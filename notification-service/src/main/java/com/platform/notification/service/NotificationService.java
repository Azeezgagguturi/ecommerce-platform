package com.platform.notification.service;

import com.platform.notification.dto.OrderPlacedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public void sendOrderConfirmation(OrderPlacedEvent event) {
        log.info("═══════════════════════════════════════════════════════════");
        log.info("  SIMULATED EMAIL NOTIFICATION");
        log.info("═══════════════════════════════════════════════════════════");
        log.info("  To:      {}", event.customerEmail());
        log.info("  Subject: Order Confirmation - {}", event.orderId());
        log.info("───────────────────────────────────────────────────────────");
        log.info("  Dear {},", event.customerName());
        log.info("");
        log.info("  Your order has been placed successfully!");
        log.info("");
        log.info("  Order Details:");
        log.info("    Order ID:    {}", event.orderId());
        log.info("    Product:     {}", event.productName());
        log.info("    Quantity:    {}", event.quantity());
        log.info("    Total:       ${}", event.totalPrice());
        log.info("    Status:      {}", event.status());
        log.info("    Placed at:   {}", event.placedAt().format(FORMATTER));
        log.info("");
        log.info("  Thank you for your purchase!");
        log.info("═══════════════════════════════════════════════════════════");

        log.info("Email notification sent successfully to {} for order {}",
                event.customerEmail(), event.orderId());
    }
}
