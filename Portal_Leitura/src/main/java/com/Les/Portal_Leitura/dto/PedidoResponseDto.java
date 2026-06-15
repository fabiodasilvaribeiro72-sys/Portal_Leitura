package com.Les.Portal_Leitura.dto;

import com.Les.Portal_Leitura.domain.cliente.ItemPedido;
import lombok.Data;

import java.util.List;


@Data
public class PedidoResponseDto {

    private Long id;
    private String status;
    private Double total; // 🔥 ESSENCIAL
    private List<ItemPedido> itens;
    private String cupom;


}