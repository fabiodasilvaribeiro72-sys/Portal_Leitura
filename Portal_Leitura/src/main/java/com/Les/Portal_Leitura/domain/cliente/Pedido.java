package com.Les.Portal_Leitura.domain.cliente;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data // <-- Mantém tudo (Getters, Setters, ToString, etc)
@NoArgsConstructor
@AllArgsConstructor
@Builder // <-- Adicionado para garantir o Pedido.builder() caso precise
@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime data;

    @ManyToOne
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens;

    private Double valorTotal;

    @ManyToOne
    private Cupom cupom;

    // 🔥 CORRIGIDO: Agora é um relacionamento com a classe Cupom, não uma String!
    @ManyToOne
    @JoinColumn(name = "cupom_troca_id")
    private Cupom cupomTroca;

    private boolean cupomTrocaAprovado;

    private String cep;

    private String rua;

    private String cidade;

    private String estado;

    @Builder.Default // 🔥 Mantido e verificado
    private Boolean solicitouTroca = false;
}