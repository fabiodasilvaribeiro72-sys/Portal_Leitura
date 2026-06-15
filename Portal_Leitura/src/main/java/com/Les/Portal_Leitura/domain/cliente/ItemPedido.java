package com.Les.Portal_Leitura.domain.cliente;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Data // <-- Substituído Getter/Setter por Data para maior consistência
@NoArgsConstructor
@AllArgsConstructor
@Builder // <-- Garante a criação de itens via builder
@Entity
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeLivro;

    private Double preco;

    private int quantidade;

    @Builder.Default // 🔥 CORRIGIDO: O Lombok agora aceita o valor padrão no Builder
    private boolean cupomTrocaAprovado = false;

    @ManyToOne
    @JoinColumn(name = "cupom_troca_id")
    private Cupom cupomTroca;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonIgnore
    private Pedido pedido;

    private String imagem;
}