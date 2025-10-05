package com.daffidev.backcityplanner.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "capas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Capa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String type;  // "pob", "vivienda", "transport", "green", etc.

    @Column(columnDefinition = "text", nullable = false)
    private String json;  // GeoJSON completo serializado como String

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
