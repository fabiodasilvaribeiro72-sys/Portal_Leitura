package com.Les.Portal_Leitura.domain.cliente;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)

    private String codigo;

    @Builder.Default // <-- Adicione aqui
    private boolean aprovado = false;

    private Double desconto;

    @Builder.Default // <-- Adicione aqui
    private boolean ativo = true;

    private boolean permiteTroca;
}