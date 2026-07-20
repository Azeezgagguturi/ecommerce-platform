package com.platform.catalog.service;

import com.platform.catalog.dto.OrderPlacedEvent;
import com.platform.catalog.dto.ProductResponse;
import com.platform.catalog.entity.Product;
import com.platform.catalog.exception.InsufficientStockException;
import com.platform.catalog.exception.ResourceNotFoundException;
import com.platform.catalog.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProductCatalogService {

    private static final Logger log = LoggerFactory.getLogger(ProductCatalogService.class);

    private final ProductRepository productRepository;

    public ProductCatalogService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByActiveTrueAndCategory(category).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getFlashSaleProducts() {
        return productRepository.findByActiveTrueAndFlashSaleTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return toResponse(product);
    }

    @Transactional
    public void decrementStock(UUID productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (product.getStockQuantity() < quantity) {
            throw new InsufficientStockException(product.getName(), quantity, product.getStockQuantity());
        }

        int updated = productRepository.decrementStock(productId, quantity);
        if (updated == 0) {
            throw new InsufficientStockException(product.getName(), quantity, product.getStockQuantity());
        }

        log.info("Stock decremented for product {}: {} units (remaining: {})",
                productId, quantity, product.getStockQuantity() - quantity);
    }

    @KafkaListener(topics = "order-events", groupId = "product-catalog-group")
    @Transactional
    public void handleOrderPlacedEvent(OrderPlacedEvent event) {
        log.info("Received OrderPlacedEvent for order {}: product {} x{}",
                event.orderId(), event.productName(), event.quantity());

        try {
            decrementStock(event.productId(), event.quantity());
            log.info("Inventory updated for order {}: product {} x{}",
                    event.orderId(), event.productName(), event.quantity());
        } catch (InsufficientStockException ex) {
            log.error("Failed to update inventory for order {}: {}", event.orderId(), ex.getMessage());
        }
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getCategory(),
                product.getImageUrl(),
                product.getFlashSale(),
                product.getFlashSalePrice(),
                product.getActive(),
                product.getCreatedAt()
        );
    }
}
