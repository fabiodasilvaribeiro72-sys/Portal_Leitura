package com.Les.Portal_Leitura.dto;
import lombok.*;


import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CarrinhoDto {


        private Long clienteId;
        private List<ItemDto> itens;

}
