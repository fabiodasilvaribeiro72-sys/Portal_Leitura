package com.Les.Portal_Leitura.dto;


import lombok.*;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PedidoDto {

    private Long clienteId;
    private List<ItemDto> itens;

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public List<ItemDto> getItens() {
        return itens;
    }

    public void setItens(List<ItemDto> itens) {
        this.itens = itens;
    }

    private Integer enderecoIndex;

    private String cidade;

    private String estado;

    private List<PagamentoDto> pagamentos;

    private String cupom;
    private String cupomTroca;

}
