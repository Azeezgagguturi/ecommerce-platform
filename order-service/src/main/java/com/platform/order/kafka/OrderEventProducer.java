package com.platform.order.kafka;

import com.platform.order.entity.OrderPlacedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class OrderEventProducer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventProducer.class);
    private static final String TOPIC = "order-events";

    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public OrderEventProducer(KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderPlacedEvent(OrderPlacedEvent event) {
        String key = event.orderId().toString();
        log.info("Sending OrderPlacedEvent to topic '{}' with key '{}': order={}, product={}",
                TOPIC, key, event.orderId(), event.productName());

        CompletableFuture<SendResult<String, OrderPlacedEvent>> future =
                kafkaTemplate.send(TOPIC, key, event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("OrderPlacedEvent sent successfully to partition={}, offset={}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Failed to send OrderPlacedEvent for order {}: {}",
                        event.orderId(), ex.getMessage(), ex);
            }
        });
    }
}
