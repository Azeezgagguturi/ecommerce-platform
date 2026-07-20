package com.platform.catalog.controller;

import com.platform.catalog.dto.DecrementStockRequest;
import com.platform.catalog.dto.ProductResponse;
import com.platform.catalog.service.ProductCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductCatalogController {

    private final ProductCatalogService productCatalogService;

    public ProductCatalogController(ProductCatalogService productCatalogService) {
        this.productCatalogService = productCatalogService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(productCatalogService.getProductsByCategory(category));
        }
        return ResponseEntity.ok(productCatalogService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productCatalogService.getProductById(id));
    }

    @GetMapping("/flash-sale")
    public ResponseEntity<List<ProductResponse>> getFlashSaleProducts() {
        return ResponseEntity.ok(productCatalogService.getFlashSaleProducts());
    }

    @PostMapping("/decrement-stock")
    public ResponseEntity<Map<String, String>> decrementStock(
            @Valid @RequestBody DecrementStockRequest request) {
        productCatalogService.decrementStock(request.getProductId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("message", "Stock decremented successfully"));
    }
}
