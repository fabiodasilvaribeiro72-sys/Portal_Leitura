package com.Les.Portal_Leitura.dto;


import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequestDTO {

    private Long clienteId;
    private Integer enderecoIndex;
    private List<Integer> cartoesSelecionados;
    private String cupom;
    private List<PagamentoDto> pagamentos;
    private String cep;
    private String estado;
    private String rua;
    private String cidade;
    private List<ItemDto> itens;
}
