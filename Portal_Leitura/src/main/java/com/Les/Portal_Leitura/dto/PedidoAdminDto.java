package com.Les.Portal_Leitura.dto;

import lombok.*;
import java.util.List;

// As anotações devem ficar aqui, antes da declaração da classe!
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoAdminDto {

    private Long id;

    private String nomeCliente;

    private String status;

    private String enderecoEntrega;

    private List<ItemDto> itens;

    private String cupom;

    private String cupomTroca;

    private boolean cupomTrocaAprovado;
}