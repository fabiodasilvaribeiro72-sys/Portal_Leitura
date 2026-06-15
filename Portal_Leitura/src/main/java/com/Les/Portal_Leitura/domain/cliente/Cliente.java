package com.Les.Portal_Leitura.domain.cliente;

import jakarta.persistence.*;
import lombok.*;


import java.util.ArrayList;
import java.util.List;

@Table( name = "cliente")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String email;

    private String telefone;

    private String senha;

    private String cpf;

    private Boolean ativo;

    private int ranking;

    private String estado;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="cliente_id")
    private List<Endereco> enderecosEntrega;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="cliente_id")
    private List<Endereco> enderecosCobranca;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Cartao> cartoes = new ArrayList<>();;



}
