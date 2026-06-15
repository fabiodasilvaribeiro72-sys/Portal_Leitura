package com.Les.Portal_Leitura.domain.cliente;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class PagamentoCartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

        private Integer id;
        private String numeroCartao;
        private Double ValorPago;

    @ManyToOne
    private Pedido pedido;

}
