package com.platform.catalog.repository;

import com.platform.catalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findByActiveTrue();

    List<Product> findByActiveTrueAndCategory(String category);

    List<Product> findByActiveTrueAndFlashSaleTrue();

    Optional<Product> findByIdAndActiveTrue(UUID id);

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :quantity WHERE p.id = :id AND p.stockQuantity >= :quantity")
    int decrementStock(@Param("id") UUID id, @Param("quantity") int quantity);

    @Query("SELECT p.stockQuantity FROM Product p WHERE p.id = :id")
    Optional<Integer> getStockQuantity(@Param("id") UUID id);
}
