package com.Les.Portal_Leitura.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoAdminResponseDto {

    private Long id;

    private String nomeCliente;

    private String status;

    private String enderecoEntrega;

    private List<ItemDto> itens;

    private String cupom;

    private boolean cupomAprovado;

    private String cupomTroca;

    private boolean cupomTrocaAprovado;

    private java.time.LocalDateTime data;
}