package com.Les.Portal_Leitura.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ItemDto {

    private String nomeLivro;
    private Double preco;
    private int quantidade;

    private String cupomTroca;
    private String imagem;


    private boolean cupomTrocaAprovado;


}
