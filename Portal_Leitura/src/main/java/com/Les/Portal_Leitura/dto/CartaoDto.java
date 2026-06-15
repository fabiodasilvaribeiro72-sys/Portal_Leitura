package com.Les.Portal_Leitura.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartaoDto {

    private Long clienteId;
    private String numero;
    private String nome;
    private String bandeira;
    private String codigo;

}
