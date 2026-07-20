package com.platform.notification.kafka;

import com.platform.notification.dto.OrderPlacedEvent;
import com.platform.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);

    private final NotificationService notificationService;

    public OrderEventConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(
            topics = "order-events",
            groupId = "notification-service-group",
            properties = {
                "spring.json.value.default.type=com.platform.notification.dto.OrderPlacedEvent"
            }
    )
    public void handleOrderPlacedEvent(OrderPlacedEvent event) {
        log.info("Received OrderPlacedEvent: orderId={}, product={}, customer={}",
                event.orderId(), event.productName(), event.customerEmail());

        notificationService.sendOrderConfirmation(event);
    }
}
