package com.platform.order.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

public class CartItem implements Serializable {

    private UUID productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;

    public CartItem() {}

    public CartItem(UUID productId, String productName, BigDecimal price, Integer quantity, String imageUrl) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
